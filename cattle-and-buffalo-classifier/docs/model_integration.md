# Model integration boundary

## Current implementation

`ml/inference/classifier.ts` exports `ClassifierAdapter`, `loadClassifier()` and `classifyImage()`. The loader deliberately returns `null`: no trained artifact or runtime exists. `classifyImage()` returns an explicit `MODEL_UNAVAILABLE` error with HTTP 503. There are no synthetic predictions or random fallbacks.

The interface accepts `ValidatedImage` from `decode-image.ts`: interleaved 8-bit 3-channel sRGB pixels, width and height, oriented by EXIF and alpha-flattened against white. It does not accept untrusted filenames or URLs. Model-specific resize/crop and normalization must be applied within the future adapter and match training exactly.

The adapter returns `{ class, confidence }`. `class` must be cattle or buffalo. `confidence` must be finite and within [0, 1]. The server and UI reject malformed responses. Application class IDs are cattle=0 and buffalo=1; numerical output positions must be mapped explicitly rather than assumed alphabetical.

## Work required before enabling predictions

1. Obtain the intended dataset lawfully, prepare group-disjoint splits, and train/evaluate a real model.
2. Produce a model manifest containing provenance, artifact checksum, training configuration and split hash, explicit labels, tensor names/shapes/layout/dtype, exact preprocessing, output interpretation (logits versus probabilities), and measured held-out metrics.
3. Install a deployment-compatible inference runtime. MobileNetV3 Small exported to ONNX is a plan, not a tested dependency or existing file loader.
4. Implement the adapter and a cached, concurrency-safe loader. Validate checksum and manifest before session creation. Fail closed on absent/corrupt/mismatched artifacts, and release resources correctly.
5. Match logits/probability interpretation and any calibration to the trained model. Avoid double softmax and do not use confidence as proof that an image contains an animal.
6. Verify numerical parity against the training framework on real held-out cattle and buffalo examples. Test loading failures, class mapping, output validation, latency and resource bounds.
7. Update `MODEL_STATUS` and the public documentation only after the artifact is available and validated. The current status is static because there is no model; a real loader should make readiness reflect actual load health.
8. Implement and evaluate rejection/uncertainty handling before claiming to recognize unrelated or non-animal images. Until then disclose the binary classifier limitation prominently.

No environment variables, API keys, or third-party service are required by the current implementation. Dropping a file into a `models/` folder does not enable predictions automatically.
