import os
os.environ["KERAS_BACKEND"] = "tensorflow"
import keras
import h5py

MODEL_PATH = 'Model/best_model_resnet_finetuned.h5'

print(f"--- Inspecting {MODEL_PATH} ---")

try:
    # Method 1: Try to read using h5py directly (Most reliable for names)
    with h5py.File(MODEL_PATH, 'r') as f:
        if 'model_weights' in f:
            print("\nLayer Names found in .h5 file:")
            # Keras saves weights under 'model_weights' group
            layer_names = list(f['model_weights'].keys())
            for name in layer_names:
                print(f" - {name}")
        else:
            print("Could not find 'model_weights' group. Is this a full model or just weights?")
            # Fallback listing
            print("Keys:", list(f.keys()))

except Exception as e:
    print(f"Error reading file: {e}")