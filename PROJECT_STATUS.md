# Current Project Status

## Completed

1. Project sitemap captured in `PROJECT_SITEMAP.md`.
2. Project overview documentation created in `docs/project_overview.md`.
3. Repository foundation started with `.gitignore` and Python dependency management.
4. Dataset-statistics audit tool created at `src/data/dataset_stats.py`.
5. Dataset integrity verified in Colab:
   - 5,652 files present in the Google Drive copy
   - 5,651 images successfully loaded by TensorFlow
   - classes: cattle and buffalo
   - 3 visually poor images were removed in the earlier cleaning stage
   - 0 corrupt/unreadable images found by the Pillow integrity check
6. Training dataset verified:
   - Train: 3,956 images loaded by TensorFlow
   - Validation: 1,132 images
   - Test: 563 images
   - Label mapping: cattle=0, buffalo=1
7. Class imbalance handled with class weights:
   - cattle (0): 0.5822542672160094
   - buffalo (1): 3.539355992844365
8. MobileNetV2 transfer-learning Stage 1 completed:
   - input: 224x224x3
   - pretrained ImageNet MobileNetV2
   - frozen base
   - best validation epoch: 9
   - validation accuracy: 91.87%
   - validation loss: 0.2127
   - best Stage-1 model saved to Google Drive
9. MobileNetV2 fine-tuning completed:
   - final 30 base-model layers fine-tuned
   - BatchNormalization layers kept frozen
   - learning rate started at 1e-5 and was reduced by ReduceLROnPlateau
   - best validation epoch: 10
   - validation accuracy: 94.88%
   - validation loss: 0.1657
   - validation precision: 78.02%
   - validation recall: 88.75%
   - best fine-tuned model saved to Google Drive at:
     `/content/drive/MyDrive/Cattle-Buffalo Models/cattle_buffalo_mobilenetv2_finetuned.keras`

## Current state

### Model

The current candidate model is **MobileNetV2 with transfer learning and fine-tuning**. The final test set has not yet been used for model selection.

### Next immediate task

Run the final evaluation on the untouched 563-image test set and record:
- Accuracy
- Precision
- Recall
- F1 score
- ROC-AUC
- Confusion matrix
- Classification report

After evaluation, perform error analysis before integrating the model into the web application.

## Important dataset note

The Roboflow README reports 5,654 images for the original export. The current Google Drive copy contains 5,652 files, while TensorFlow loads 5,651 images. The discrepancy is being retained as a documented dataset bookkeeping issue rather than silently inventing a count. The model is currently trained on the 5,651 images accepted by TensorFlow.

## Important rule

No test performance, F1, ROC-AUC, inference time, or other final performance value will be invented. Those values will be generated only from the actual test experiment.
