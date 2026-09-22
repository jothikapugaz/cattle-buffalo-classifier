import io
import os
from functools import lru_cache

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from PIL import Image, UnidentifiedImageError

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    "/models/cattle_buffalo_mobilenetv2_finetuned.keras",
)
MAX_IMAGE_BYTES = 3 * 1024 * 1024
IMAGE_SIZE = (224, 224)

app = FastAPI(title="CattleBuffalo TensorFlow Inference Service")


@lru_cache(maxsize=1)
def get_model():
    if not os.path.isfile(MODEL_PATH):
        raise RuntimeError(f"Model artifact not found: {MODEL_PATH}")
    return tf.keras.models.load_model(MODEL_PATH, compile=False)


@app.get("/health")
def health():
    try:
        get_model()
        return {
            "status": "ok",
            "architecture": "MobileNetV2",
            "classes": {"cattle": 0, "buffalo": 1},
            "input_size": [224, 224, 3],
        }
    except Exception as exc:
        raise HTTPException(status_code=503, detail="Model is unavailable.") from exc


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in {"image/jpeg", "image/png", "image/webp"}:
        raise HTTPException(status_code=415, detail="Unsupported image type.")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty image.")
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image is larger than 3 MB.")

    try:
        with Image.open(io.BytesIO(data)) as image:
            image = image.convert("RGB")
            image = image.resize(IMAGE_SIZE, Image.Resampling.NEAREST)
            array = np.asarray(image, dtype=np.float32)
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise HTTPException(status_code=400, detail="Invalid image.") from exc

    model = get_model()
    prediction = model.predict(np.expand_dims(array, axis=0), verbose=0)
    buffalo_probability = float(prediction[0][0])
    cattle_probability = 1.0 - buffalo_probability

    if cattle_probability >= buffalo_probability:
        predicted_class = "cattle"
        confidence = cattle_probability
    else:
        predicted_class = "buffalo"
        confidence = buffalo_probability

    return {
        "class": predicted_class,
        "confidence": confidence,
    }
