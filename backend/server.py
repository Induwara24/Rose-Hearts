import os
# Ensure Keras uses TensorFlow backend
os.environ["KERAS_BACKEND"] = "tensorflow"

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import shutil
import keras
from keras.models import Model
from keras.layers import Input, Dense, GlobalAveragePooling2D, Dropout
from keras.applications import ResNet50
from keras.applications.resnet50 import preprocess_input
import base64 
import numpy as np

# --- 1. Reconstruct the Model Architecture ---
def build_model_architecture():
    # Matches 'input_layer' from your file
    inputs = Input(shape=(224, 224, 3), name="input_layer")
    
    # 1. Preprocessing
    x = preprocess_input(inputs)
    
    # 2. Base Model
    # We instantiate ResNet50 and explicitly set its name to match 'resnet50' from your file
    base_model = ResNet50(include_top=False, weights=None)
    base_model.name = "resnet50" # Standard property (not _name)
    
    # Nest it
    x = base_model(x)
    
    # 3. Classification Head
    # Names match 'global_avg_pool', 'dense_128', 'dropout_0.5', 'output_layer'
    x = GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = Dense(128, activation='relu', name="dense_128")(x)
    x = Dropout(0.5, name="dropout_0.5")(x)
    outputs = Dense(3, activation='softmax', name="output_layer")(x)
    
    model = Model(inputs, outputs)
    return model

# --- 2. Load Weights with Verification ---
MODEL_PATH = 'Model/best_model_resnet_finetuned.h5'
model = None

try:
    print("Constructing model...")
    model = build_model_architecture()
    
    # Debug: Check name consistency
    print("Layer names in reconstructed model:", [layer.name for layer in model.layers])
    
    # 1. Get a checksum of weights BEFORE loading (to verify change)
    # We look at the last layer's weights
    initial_weights = model.get_layer("output_layer").get_weights()
    initial_sum = np.sum([np.sum(w) for w in initial_weights]) if initial_weights else 0
    
    print(f"Loading weights from {MODEL_PATH}...")
    # Load by name
    model.load_weights(MODEL_PATH, by_name=True)
    
    # 2. Get checksum AFTER loading
    final_weights = model.get_layer("output_layer").get_weights()
    final_sum = np.sum([np.sum(w) for w in final_weights])
    
    print(f"Weight Checksum -- Initial: {initial_sum:.4f}, Final: {final_sum:.4f}")
    
    if initial_sum == final_sum and initial_sum != 0:
        raise RuntimeError("CRITICAL: Weights did not change! Load failed silently.")
        
    print("✅ Model weights loaded and verified successfully!")

except Exception as e:
    print(f"❌ CRITICAL ERROR LOADING MODEL: {e}")
    model = None 
    # We do NOT exit here to allow you to see the error, 
    # but the /predict endpoint will fail safely.

# --- FastAPI Setup ---
app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
LAST_IMAGE_ARRAY = None
LAST_PREDICTED_CLASS = None

@app.get('/')
def read_root():
    status = "Active" if model else "Failed to Load"
    return {'message': f'BCD model API - ResNet-50. Status: {status}'}

@app.post('/predict')
async def predict(image: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model failed to initialize. Check server logs.")
    
    global LAST_IMAGE_ARRAY, LAST_PREDICTED_CLASS
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
        shutil.copyfileobj(image.file, tmp)
        tmp_path = tmp.name

    try:
        from utils import test_sample_image 
        class_name, confidence, probabilities, img_array_batch = test_sample_image(model, tmp_path)
        
        LAST_IMAGE_ARRAY = img_array_batch
        LAST_PREDICTED_CLASS = class_name
        
        return JSONResponse({
            'prediction': class_name,
            'confidence': f"{confidence:.2f}",
            'probabilities': {
                'Benign': f"{probabilities[0]*100:.2f}",
                'Malignant': f"{probabilities[1]*100:.2f}",
                'Normal': f"{probabilities[2]*100:.2f}"
            }
        })
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)

@app.get("/explain_all")
async def explain_all():
    if LAST_IMAGE_ARRAY is None:
        raise HTTPException(status_code=400, detail="No image has been predicted yet.")

    try:
        from utils import generate_grad_cam, generate_lime
        
        gradcam_bytes = generate_grad_cam(model, LAST_IMAGE_ARRAY).read()
        lime_bytes = generate_lime(model, LAST_IMAGE_ARRAY[0]).read()

        return JSONResponse({
            'gradcam_image_base64': base64.b64encode(gradcam_bytes).decode('utf-8'),
            'lime_image_base64': base64.b64encode(lime_bytes).decode('utf-8')
        })
    except Exception as e:
        print(f"XAI Generation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))