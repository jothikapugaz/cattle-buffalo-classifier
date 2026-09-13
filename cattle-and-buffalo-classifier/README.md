# CattleBuffalo AI

A responsive, accessible image-classification workspace built with Next.js, TypeScript, React, Tailwind CSS, and shadcn/ui.

## Current status: State B

**Model training pending dataset access.**

The frontend, image-validation pipeline, prediction API boundary, status API, and automated tests are implemented. There is **no trained classifier**, no loaded checkpoint, and no evaluation metrics. A valid upload returns a structured HTTP 503 rather than a fabricated prediction. This is a working application shell, not a working animal-recognition model.

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

Open http://localhost:3000. No keys, credentials, model downloads, or environment variables are needed for the pending-model application.

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
  → loadClassifier() / ClassifierAdapter
  → structured prediction OR explicit error
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
| `ml/inference/classifier.ts` | Typed adapter and fail-closed loader |
| `tests/` | Request, decoder, contract, and UI tests |
| `docs/` | Dataset gate, future pipeline, integration contract |
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

MobileNetV3 Small transfer learning is the planned baseline, subject to confirming a suitable training runtime and inspecting the real dataset. ONNX is the planned deployment format. Neither the training framework nor ONNX runtime is installed, and no artifact-loading code is claimed to work.

After access is granted: implement a reproducible training pipeline with explicit class IDs, fixed seeds, checkpointing, validation monitoring, best-checkpoint selection and early stopping. The current `ClassifierAdapter` decouples that future implementation from the UI and API; `loadClassifier()` intentionally returns `null` now. Simply dropping an ONNX file into the project is not sufficient. See `docs/model_integration.md`.

## Evaluation and error analysis

Not performed: accuracy, precision, recall, F1, confusion matrix, per-class performance, training curves, and error analysis. There is no untouched test set yet. None of the UI percentages or model-quality charts are populated.

After training, evaluate once on a held-out group-disjoint test set; report all requested metrics and inspect errors involving lighting, viewpoint, partial visibility, multiple animals, resolution, background, and visually similar breeds. Do not tune on test examples.

## Inference API

`GET /api/model` returns actual availability, planned architecture, class mapping, and `metrics: null`.

`POST /api/predict` accepts exactly one multipart file field named `image`.

Current valid-file response (HTTP 503):

```json
{
  "error": {
    "code": "MODEL_UNAVAILABLE",
    "message": "Model training pending dataset access"
  }
}
```

All application errors follow `{ "error": { "code": "...", "message": "..." } }`. Invalid requests/images return 400, unsupported formats 415, oversized payloads 413, unavailable model 503, and unexpected failures 500. Responses use `Cache-Control: no-store`. Host-level rejection can occur before the route executes; the UI catches non-JSON/network failures as well.

Future success contract: `class` is `cattle` or `buffalo`; `confidence` is a finite number from 0 through 1. Both server and client validate the shape. No success response is currently generated.

## Testing

Run `pnpm test` for Vitest tests covering actual multipart requests and Sharp decoding, missing/multiple/oversized/corrupt/unsupported uploads, MIME mismatch, dimensions, explicit mapping, model loader, status endpoint, schema guards, UI preview/reset/drop/error/loading paths, backend failure, and stale-request cancellation.

Synthetic pixel fixtures validate transport and image handling only. Mock browser decoding/network failures test UI behavior; they do not claim animal recognition or model quality. No cattle/buffalo inference evaluation can run without genuine test images and a real trained model. Browser/build verification findings are recorded separately in `docs/verification.md` after execution.

## Security and privacy

Images stay in the browser until Analyze is selected. The API uses bounded in-memory processing, does not persist uploads or log filenames/contents, rejects unsafe formats, and never requests arbitrary URLs. No secrets or external service credentials are required. User request cancellation prevents stale UI updates; it cannot guarantee cancellation of work already received by the server. The production host may maintain ordinary HTTP access logs.

The application sends `nosniff`, strict referrer policy, HSTS, and disabled camera/microphone/geolocation permissions as response headers. It intentionally remains embeddable as a public portfolio preview. Image/request limits provide basic resource protection, not distributed abuse protection; add production throttling and monitoring before a high-traffic launch.

## Limitations and future improvements

- No animal/non-animal recognition, breed identification, trained model, confidence calibration, or evaluation yet.
- A binary model cannot reliably reject unrelated images, even with a high confidence score. A separate evaluated rejection strategy is required.
- Establish authorized dataset access, confirm licensing, inspect labels, and train/evaluate before enabling predictions.
- Add an evaluated ONNX adapter with matching preprocessing, checksummed artifact and provenance manifest, and verified mapping.
- Add real cattle/buffalo integration fixtures and end-to-end model tests after obtaining rights and a held-out set.
- Add calibrated uncertainty and out-of-distribution evaluation before making stronger reliability claims.
