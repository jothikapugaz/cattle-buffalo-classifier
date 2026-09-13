# Dataset plan — pending authorized access

This is a plan, not an executed pipeline. No dataset, manifests, model weights, or ML metrics exist. The app is independently implemented using the State B fallback.

## Acquisition gate

Use only the intended Dheepika Roboflow dataset through a public/authorized export. Retain source/version/license metadata. Do not bypass security controls, guess signed URLs, request private credentials, substitute another dataset, or use website artwork. See `data_source_verification.md` for evidence of the blocker.

## Reproducible preparation

1. Inspect archive manifest and labels before extraction. Reject absolute paths, traversal, symlinks, unexpected formats, and excessive extraction size. Preserve originals.
2. Explicit mapping: cattle=0, buffalo=1. Never inherit alphabetical class indices. Exclude `unlabelled`; report real excluded counts.
3. Decode and validate every image, record corrupt/empty/unsupported/small files, dimensions, class counts and label-review outcomes. Quarantine issues without silently deleting original data.
4. Compute SHA-256 duplicates and perceptual similarity candidates. Group exact duplicates, reviewed near-duplicates, and known same-scene/source sequences. Quarantine conflicting labels for review.
5. Create class-stratified group-disjoint splits targeting 70% train, 15% validation, 15% test with seed 42. Group integrity takes precedence over exact percentages; document real deviations. Require both classes in each split.
6. Emit machine-readable manifest/statistics JSON and a human-readable summary: retained/excluded/corrupt/duplicate counts, per-class totals, actual split counts, data hashes and preprocessing version.
7. Assert that no source group, exact duplicate, or reviewed near-duplicate crosses split boundaries. Apply augmentation only to the training split after splitting.

## Training — not implemented yet

- Planned baseline: MobileNetV3 Small transfer learning, subject to runtime and data suitability.
- Establish a pinned training environment and authorized pretrained weights; do not install Python tooling until it can be meaningfully exercised.
- Match orientation, RGB conversion, alpha handling, resize/crop, normalization and class mapping between validation/test and inference. The current server only decodes images; model-specific normalization is not implemented.
- Record seed, split digest, dependencies, hyperparameters, loss/accuracy histories, checkpoint hashes, optimizer, learning rate and augmentation configuration.
- Save checkpoints, select the best with validation-only performance, and apply early stopping. Never tune on the untouched test split.

## Evaluation and error analysis — pending

Generate real test accuracy, per-class precision/recall/F1, confusion matrix, and sample-level predictions only after training. Inspect failures for illumination, viewpoints, occlusion, resolution, backgrounds, multiple animals, and similar breeds. Evaluate non-animal/out-of-distribution behavior separately; binary confidence is not a reliable rejection signal.

## Deployment gate

Export and verify ONNX only after reproducible evaluation. Compare runtime outputs against the training framework on actual held-out examples. Add an artifact/provenance manifest, explicit labels, normalization contract and checksum; implement the adapter described in `model_integration.md`. Publish measured results with limitations. Until those gates pass, preserve the explicit unavailable status and do not emit predictions.
