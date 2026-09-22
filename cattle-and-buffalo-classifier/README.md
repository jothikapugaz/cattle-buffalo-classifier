# CattleBuffalo AI

A responsive, accessible image-classification workspace built with Next.js, TypeScript, React, Tailwind CSS, and shadcn/ui.

## Current status: State C

**Evaluated MobileNetV2 integrated behind a Python TensorFlow inference service.**

The frontend, image-validation pipeline, prediction API, model adapter, and TensorFlow service are implemented. The trained `.keras` artifact is intentionally kept outside GitHub. Local prediction requires the model file plus the Python inference service described in `ml-service/README.md`.

## Features

- Desktop/mobile interface, drag-and-drop or file picker, local image preview, reset, loading, and useful errors.
- JPG, PNG, WebP; maximum 3 MiB, minimum 32 × 32, maximum 20 megapixels; one still image per request.
- Browser validation followed by independent server validation, MIME/content agreement, full image decoding, and bounded multipart parsing.
- Explicit pending-model status; a guarded class/confidence result component for eventual real inference.
- Keyboard-accessible controls, semantic sections, live announcements, reduced-motion support, and model-transparency content.
- Uploads processed transiently in memory. No database, storage bucket, analytics, image logging, or third-party inference service.

## Run locally

Use the v0 preview to try the application without installing anything. To develop locally, obtain the project through the connected GitHub repository or v0's shadcn CLI installation option.

Prerequisites: Node.js 22.12+ (or Node 24), pnpm 10+.

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000. The Next.js application requires `MODEL_SERVICE_URL` when predictions are enabled. The TensorFlow service requires `MODEL_PATH` pointing to the trained model artifact.

```bash
pnpm test
pnpm typecheck
pnpm build
pnpm start
```

`pnpm start` requires a successful build; stop the development server first if it occupies port 3000. `pnpm test:watch` runs tests interactively.

## Architecture

```text
React upload workspace
  → POST /api/predict
  → bounded multipart parser
  → Sharp decode + validation
  → ClassifierAdapter
  → private Python TensorFlow inference service
  → MobileNetV2 prediction OR explicit error
```

| Location | Responsibility |
| --- | --- |
| `app/page.tsx` | Main page composition |
| `components/classifier-workspace.tsx` | Upload, preview, lifecycle, request and errors |
| `components/prediction-result.tsx` | Future real prediction presentation |
| `components/project-details.tsx` | How it works and limitations |
| `app/api/predict/route.ts` | Prediction HTTP boundary |
| `app/api/model/route.ts` | Honest machine-readable model status |
| `lib/classifier-contract.ts` | Mapping, validation, schema guard, model status |
| `lib/read-upload.ts` | Request-size and multipart enforcement |
| `ml/inference/decode-image.ts` | Full RGB decode with Sharp |
| `ml/inference/classifier.ts` | Typed adapter to the Python TensorFlow service |
| `tests/` | Request, decoder, contract, and UI tests |
| `ml-service/` | FastAPI/TensorFlow inference service for the `.keras` model |
| `docs/` | Dataset, evaluation, and model integration documentation |
| `public/images/` | Generated editorial artwork, never ML data |

## Dataset and licensing

Intended source: **Cattle&Buffalo breed classificat — Dheepika — Roboflow Universe**.

- Source: https://universe.roboflow.com/dheepika/cattle-buffalo-breed-classificat
- Reported license: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Reported size: 5,654 images, supplied by the user, not independently audited.
- Reported classes: cattle, buffalo, unlabelled.
- Required mapping: `cattle → 0`, `buffalo → 1`. Exclude `unlabelled` completely from positive training classes.

The source is behind a Cloudflare security-verification challenge in this environment. No security controls were bypassed, no private credentials were used, and no dataset was downloaded. The dataset attribution describes an **intended source**, not data used by an existing model. See `docs/data_source_verification.md`.

The two website portraits were generated as illustrative artwork. They are not Roboflow images, training samples, test examples, or evidence of model performance.

## Data preprocessing

**Implemented for uploads:** browser MIME/size/decode checks; server MIME/format match; strict complete decoding; pixel and dimension limits; EXIF auto-orientation; conversion to 3-channel sRGB; alpha compositing onto white. Animated files are rejected on the server. Raw pixel data is never returned to the client.

**Planned for training, not implemented:** authorized export inspection, exclude unlabelled, corrupt-image audit, SHA-256 duplicates, reviewed near-duplicate/source grouping, group-aware stratified 70/15/15 train/validation/test split with seed 42, count manifests, deterministic validation/test preprocessing and training-only augmentation. See `docs/dataset_plan.md`. No fake split manifests or statistics exist.

## Model architecture and training

The trained model is a fine-tuned MobileNetV2 with 224 × 224 RGB input and explicit mapping `cattle → 0`, `buffalo → 1`. Stage 1 used a frozen ImageNet base followed by fine-tuning of the final 30 base-model layers with BatchNormalization kept frozen. The best fine-tuned checkpoint was saved as `cattle_buffalo_mobilenetv2_finetuned.keras`.

The artifact is not committed to GitHub. The deployment path uses a separate Python TensorFlow service, while the Next.js application remains the public API/UI layer. See `ml-service/README.md` and `docs/model_integration.md`.

## Evaluation and error analysis

The official held-out test benchmark contains 563 images. Accuracy is 94.14%, buffalo precision is 72.55%, buffalo recall is 93.67%, buffalo F1 is 81.77%, and ROC-AUC is 0.9834. The confusion matrix is `[[456, 28], [5, 74]]` with cattle = 0 and buffalo = 1.

Error analysis found 33 mistakes, with 28 cattle→buffalo and 5 buffalo→cattle. Several problematic test images showed severe crops, overlays, non-natural graphics, or possible label issues. Grad-CAM analysis of representative errors and clean baselines found broad anatomical/contextual attention rather than a single established visual shortcut. The official benchmark remains 94.14%; a post-hoc diagnostic subset was not treated as a replacement benchmark.

After training, evaluate once on a held-out group-disjoint test set; report all requested metrics and inspect errors involving lighting, viewpoint, partial visibility, multiple animals, resolution, background, and visually similar breeds. Do not tune on test examples.

## Inference API

`GET /api/model` returns actual availability, planned architecture, class mapping, and `metrics: null`.

`POST /api/predict` accepts exactly one multipart file field named `image`.

When the model service is not configured, valid uploads return HTTP 503. When it is configured and healthy, the success response is:

```json
{
  "class": "cattle",
  "confidence": 0.9999
}
```

All application errors follow `{ "error": { "code": "...", "message": "..." } }`. Invalid requests/images return 400, unsupported formats 415, oversized payloads 413, unavailable model 503, and unexpected failures 500. Responses use `Cache-Control: no-store`. Host-level rejection can occur before the route executes; the UI catches non-JSON/network failures as well.

The success contract: `class` is `cattle` or `buffalo`; `confidence` is a finite number from 0 through 1. Both server and client validate the shape. No success response is currently generated.

## Testing

Run `pnpm test` for Vitest tests covering actual multipart requests and Sharp decoding, missing/multiple/oversized/corrupt/unsupported uploads, MIME mismatch, dimensions, explicit mapping, model loader, status endpoint, schema guards, UI preview/reset/drop/error/loading paths, backend failure, and stale-request cancellation.

Synthetic pixel fixtures validate transport and image handling only. Mock browser decoding/network failures test UI behavior; they do not claim animal recognition or model quality. No cattle/buffalo inference evaluation can run without genuine test images and a real trained model. Browser/build verification findings are recorded separately in `docs/verification.md` after execution.

## Security and privacy

Images stay in the browser until Analyze is selected. The API uses bounded in-memory processing, does not persist uploads or log filenames/contents, rejects unsafe formats, and never requests arbitrary URLs. No secrets or external service credentials are required. User request cancellation prevents stale UI updates; it cannot guarantee cancellation of work already received by the server. The production host may maintain ordinary HTTP access logs.

The application sends `nosniff`, strict referrer policy, HSTS, and disabled camera/microphone/geolocation permissions as response headers. It intentionally remains embeddable as a public portfolio preview. Image/request limits provide basic resource protection, not distributed abuse protection; add production throttling and monitoring before a high-traffic launch.

## Limitations and future improvements

- No animal/non-animal rejection model is implemented; a high binary confidence score is not proof that an image contains an animal.
- Production deployment still requires a secure model artifact location and a reachable Python inference service.
- Verify exact TensorFlow/Keras version compatibility and numerical parity between the service and the verified Colab inference function.
- Add genuine end-to-end integration fixtures and latency/resource benchmarks.
- Add calibrated uncertainty and out-of-distribution evaluation before making stronger reliability claims.
