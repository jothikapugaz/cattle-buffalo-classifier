# Current Project Status

## Completed

1. Project sitemap captured in `PROJECT_SITEMAP.md`.
2. Project overview documentation created in `docs/project_overview.md`.
3. Repository foundation started with `.gitignore` and Python dependency management.
4. Dataset-statistics audit tool created at `src/data/dataset_stats.py`.
5. Existing dataset investigation results recorded:
   - 5,651 final images
   - classes: cattle and buffalo
   - 3 visually poor images removed
   - 0 exact duplicates/data-leakage findings in the completed audit
   - 0 corrupt/unreadable images in the completed audit
   - channel/format audit performed

## In progress

### Dataset statistics and remaining audit
The code needed to calculate exact class counts, class distribution, resolutions, aspect ratios, channels, formats, and corrupt-image checks is now in the repository.

The actual final dataset is not stored in GitHub, so the exact cattle/buffalo counts and the remaining measured statistics cannot honestly be filled in until the final dataset is available to the execution environment.

## Next dependency-safe task

**Data preprocessing pipeline** will begin after the final dataset audit is available. It will cover:

- image loading
- deterministic label mapping (`cattle=0`, `buffalo=1`)
- resizing
- normalization
- reproducible train/validation/test split
- dataset pipeline

We will test this stage before starting model development.

## Important rule

No model accuracy, precision, recall, F1, ROC-AUC, training time, inference time, or other performance value will be invented. Those values will be generated only from actual experiments.
