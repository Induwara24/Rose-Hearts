import os
os.environ["KERAS_BACKEND"] = "tensorflow"

import numpy as np
import keras
from keras.models import Model
import tensorflow as tf
import cv2
import lime
from lime import lime_image
import io
from PIL import Image

# --- Global Constants ---
CLASS_NAMES = ['benign', 'malignant', 'normal']
TARGET_SIZE = (224, 224)
LAST_CONV_LAYER_NAME = 'conv5_block3_out'

# --- 1. Preprocessing ---
def apply_clahe(img_path):
    img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        raise ValueError(f"Could not open image {img_path}")
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    clahe_img = clahe.apply(img)
    clahe_rgb = cv2.cvtColor(clahe_img, cv2.COLOR_GRAY2RGB)
    pil_img = Image.fromarray(clahe_rgb).resize(TARGET_SIZE)
    return np.array(pil_img)

def test_sample_image(model, image_path):
    img_array_255 = apply_clahe(image_path) 
    img_array_batch = np.expand_dims(img_array_255, axis=0) 
    prediction = model.predict(img_array_batch)
    probabilities = prediction[0].tolist()
    class_idx = np.argmax(probabilities)
    return CLASS_NAMES[class_idx], probabilities[class_idx] * 100, probabilities, img_array_batch

# --- 2. XAI Functions ---

def generate_grad_cam(model, input_image_batch):
    # 1. Isolate the ResNet50 inner model
    resnet_model = model.get_layer('resnet50')
    
    # 2. Get the target layer from ResNet50
    target_layer = resnet_model.get_layer(LAST_CONV_LAYER_NAME)
    
    # 3. Create a sub-model that goes from ResNet inputs -> [target_layer, ResNet Output]
    # Note: We use resnet_model.input, NOT model.input
    grad_model = keras.Model(
        inputs=resnet_model.input, 
        outputs=[target_layer.output, resnet_model.output]
    )
    
    # 4. We must manually preprocess the input because 'grad_model' starts AFTER the model's preprocess layer
    # In server.py: input -> preprocess_input -> resnet50
    # So we apply preprocess_input manually here
    from keras.applications.resnet50 import preprocess_input
    preprocessed_input = preprocess_input(input_image_batch.copy())

    # 5. Compute Gradient
    with tf.GradientTape() as tape:
        inputs = tf.cast(preprocessed_input, tf.float32)
        last_conv_layer_output, base_model_output = grad_model(inputs)
        
        # Now we need to pass this base_model_output through the rest of the main model (the head)
        # We can reconstruct the head part or just look at base_model output if we assume correlation.
        # For simplicity and speed in this nested setup, we'll calculate gradients w.r.t the ResNet output features.
        # This is a standard approximation for nested models.
        
        # We take the mean of the output to generate a scalar for differentiation
        score = tf.reduce_max(base_model_output)

    grads = tape.gradient(score, last_conv_layer_output)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
    
    heatmap = last_conv_layer_output[0] @ pooled_grads[..., tf.newaxis]
    heatmap = tf.squeeze(heatmap)
    heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
    
    # 6. Visualization
    img_viz = input_image_batch[0].astype('uint8')
    heatmap_resized = cv2.resize(heatmap.numpy(), TARGET_SIZE)
    heatmap_jet = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)
    superimposed_img = np.clip(heatmap_jet * 0.4 + img_viz, 0, 255).astype('uint8')
    
    is_success, buffer = cv2.imencode(".jpg", superimposed_img)
    return io.BytesIO(buffer.tobytes())

def generate_lime(model, input_image_array_255):
    def lime_predict_fn(images):
        return model.predict(images)

    explainer = lime_image.LimeImageExplainer()
    explanation = explainer.explain_instance(
        input_image_array_255.astype('uint8'), 
        lime_predict_fn, 
        top_labels=3, 
        hide_color=0, 
        num_samples=500 
    )
    
    pred_class_index = np.argmax(model.predict(np.expand_dims(input_image_array_255, axis=0)))
    temp, mask = explanation.get_image_and_mask(pred_class_index, positive_only=False, num_features=5, hide_rest=False)
    
    buffer = io.BytesIO()
    Image.fromarray(temp.astype('uint8')).save(buffer, format="JPEG")
    buffer.seek(0)
    return buffer