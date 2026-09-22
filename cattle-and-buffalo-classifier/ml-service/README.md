# TensorFlow inference service

This service runs the trained CattleBuffalo MobileNetV2 Keras artifact outside the Next.js/Node runtime.

## Model artifact

Do not commit the model to GitHub.

Set MODEL_PATH to the local or mounted path of cattle_buffalo_mobilenetv2_finetuned.keras.

The trained output mapping is explicit:

- cattle = 0
- buffalo = 1

The service resizes decoded RGB images to 224 x 224 and passes float32 pixel values in the same 0-255 range used by the verified Colab inference function.

## Local setup

Python 3.11+ is recommended for the TensorFlow service.

    cd cattle-and-buffalo-classifier/ml-service
    python -m venv .venv

Windows:

    .venv\Scripts\activate

macOS/Linux:

    source .venv/bin/activate

Install dependencies:

    pip install -r requirements.txt

Set MODEL_PATH to the trained Keras file before starting.

Start the service:

    uvicorn app:app --host 127.0.0.1 --port 8001

Health check:

    GET http://127.0.0.1:8001/health

Prediction endpoint:

    POST http://127.0.0.1:8001/predict
    multipart field: file

The service loads the Keras model once and reuses it for subsequent requests.

## Next.js connection

Set the Next.js environment variable:

    MODEL_SERVICE_URL=http://127.0.0.1:8001

The Next.js adapter sends validated RGB pixels to this service and validates the returned { class, confidence } contract.

For deployment, use a private/internal network or authenticated service-to-service connection rather than exposing the TensorFlow service directly to the public internet.
