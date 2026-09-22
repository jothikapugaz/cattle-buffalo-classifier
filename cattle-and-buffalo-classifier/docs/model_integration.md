# Model integration boundary

## Current implementation

The project now has a real evaluated model and a separate TensorFlow inference service.

- Model: fine-tuned MobileNetV2
- Input: 224 × 224 × 3 RGB
- Classes: cattle = 0, buffalo = 1
- Artifact: cattle_buffalo_mobilenetv2_finetuned.keras
- Official test accuracy: 94.14% on 563 images
- Buffalo precision: 72.55%
- Buffalo recall: 93.67%
- Buffalo F1: 81.77%
- ROC-AUC: 0.9834

The Keras artifact is intentionally not committed to GitHub.

## Runtime architecture

```
Next.js /api/predict
  -> Sharp validation and RGB decode
  -> ClassifierAdapter
  -> MODEL_SERVICE_URL
  -> Python FastAPI + TensorFlow
  -> MobileNetV2 .keras artifact
  -> { class, confidence }
```

The Next.js adapter converts the already validated RGB pixel buffer to PNG and sends it to the private inference service. The Python service resizes it to 224 × 224 and passes float32 pixel values in the verified 0–255 range used by the Colab inference function.

## Local setup

1. Start the Python service from `ml-service/`.
2. Set `MODEL_PATH` to the trained Keras artifact.
3. Start Uvicorn on port 8001.
4. Set `MODEL_SERVICE_URL=http://127.0.0.1:8001` in the Next.js environment.
5. Start Next.js.
6. Test `GET /health` on the Python service, then upload an image through the web app.

The Python service loads the model once and reuses the loaded model for requests.

## Fail-closed behavior

If `MODEL_SERVICE_URL` is absent, the Next.js classifier returns HTTP 503 with `MODEL_UNAVAILABLE`. If the Python service is unreachable, returns an invalid response, or reports the model as unavailable, the application does not fabricate a prediction.

## Deployment requirement

The Next.js host and TensorFlow service must be able to communicate over a private or authenticated service-to-service connection. The Keras model should be stored outside the public Git repository and mounted or downloaded into the inference service at deployment time.

Before production deployment, verify model-load compatibility with the exact TensorFlow/Keras version used for training and run numerical parity tests against known held-out examples.
