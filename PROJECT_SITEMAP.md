# Cattle-Buffalo Classifier — Master Sitemap & Task Tracker

This file is the source of truth for project progress. Items are marked:

- **DONE** — completed and verified
- **PARTIAL** — some work exists, but the full requirement is not complete
- **TODO** — not completed yet
- **BLOCKED** — requires a result/input that does not exist yet

## Current verified project state

- Mendeley ACI dataset investigated.
- Roboflow classification export prepared.
- 5,651 images remain after removing 3 visually poor training images.
- Classes in the final export: `cattle` and `buffalo`.
- Exact duplicate audit: 0 duplicates/leakage found.
- Image integrity audit: 0 corrupt/unreadable images found.
- Image channel/format audit performed.
- The GitHub repository is now the project workspace; code and documentation will be added incrementally.
- No trained model or application code has been committed yet.

> Important: numerical values not yet verified from the final dataset are intentionally left as TODO rather than guessed.

## 01. PROJECT OVERVIEW

- [TODO] Problem Statement
- [TODO] Project Objective
- [TODO] Why Cattle vs Buffalo Classification?
- [TODO] Real-World Use Case
- [TODO] Scope
- [TODO] Limitations
- [TODO] Future Scope

## 02. DATASET

### Dataset Sources
- [DONE] Mendeley ACI Dataset investigation
- [DONE] Roboflow Dataset export

### Dataset Structure
- [DONE] Cattle
- [DONE] Buffalo
- [DONE] Unlabelled — investigated during source analysis; not part of the final two-class export

### Dataset Statistics
- [DONE] Total Images — 5,651 final exported images
- [TODO] Cattle Count — must be read from the final exported dataset
- [TODO] Buffalo Count — must be read from the final exported dataset
- [TODO] Class Distribution — must be calculated from the final exported dataset

### Dataset Documentation
- [DONE] Source investigation
- [TODO] License verification/documentation
- [TODO] Collection Method documentation
- [DONE] Known Issues investigation started

## 03. DATASET INVESTIGATION

- [DONE] Folder Structure Verification
- [DONE] Class Verification
- [DONE] Image Count Audit
- [DONE] Duplicate Detection
- [DONE] Data Leakage Check
- [DONE] Corrupt Image Detection
- [DONE] Image Format Audit
- [DONE] Channel Audit
  - [DONE] RGB
  - [DONE] RGBA
  - [TODO] Grayscale — final documented count/decision
- [TODO] Resolution Audit
- [TODO] Aspect Ratio Analysis
- [TODO] Class Imbalance Analysis
- [DONE] Visual Quality Inspection — 3 visually poor training images removed
- [DONE] Unlabelled Image Investigation
- [DONE] Final Dataset Decision

## 04. DATA CLEANING

- [DONE] Remove Corrupt Images — none found
- [DONE] Remove Duplicates — none found
- [DONE] Remove Poor-Quality Images — 3 removed
- [TODO] Remove Incorrect Labels — final audit required
- [DONE] Handle Unlabelled Images — excluded from final two-class export
- [TODO] Standardize Image Formats
- [TODO] Standardize Color Channels
- [DONE] Final Clean Dataset — 5,651 images in the final export

## 05. DATA PREPROCESSING

- [TODO] Image Loading
- [TODO] Resize Images
- [TODO] Normalize Pixel Values
- [TODO] Label Encoding (Cattle → 0, Buffalo → 1)
- [TODO] Train / Validation / Test Split
- [TODO] Dataset Pipeline

## 06. DATA AUGMENTATION

- [TODO] Horizontal Flip
- [TODO] Rotation
- [TODO] Zoom
- [TODO] Translation
- [TODO] Brightness Variation
- [TODO] Contrast Variation
- [TODO] Augmentation Validation

## 07. EXPLORATORY DATA ANALYSIS

- [TODO] Class Distribution Graph
- [TODO] Sample Image Grid
- [TODO] Image Size Distribution
- [TODO] Aspect Ratio Distribution
- [TODO] RGB/RGBA Distribution
- [TODO] Brightness Analysis
- [TODO] Background Analysis
- [TODO] Augmented Image Examples

## 08. MODEL DEVELOPMENT

### Baseline Model
- [TODO] Architecture
- [TODO] Input Shape
- [TODO] Output Layer
- [TODO] Baseline Performance

### Transfer Learning
- [TODO] Candidate Model 1
- [TODO] Candidate Model 2
- [TODO] Candidate Model 3

### Model Selection
- [TODO] Accuracy
- [TODO] Validation Performance
- [TODO] Model Size
- [TODO] Training Time
- [TODO] Inference Time

- [TODO] Final Model

## 09. MODEL TRAINING

### Training Configuration
- [TODO] Epochs
- [TODO] Batch Size
- [TODO] Learning Rate
- [TODO] Optimizer
- [TODO] Loss Function

### Callbacks
- [TODO] Early Stopping
- [TODO] Model Checkpoint
- [TODO] Learning Rate Scheduler

- [TODO] Training
- [TODO] Fine-Tuning

## 10. MODEL EVALUATION

- [TODO] Test Dataset
- [TODO] Accuracy
- [TODO] Precision
- [TODO] Recall
- [TODO] F1 Score
- [TODO] ROC-AUC
- [TODO] Confusion Matrix
- [TODO] Classification Report
- [TODO] Error Analysis

## 11. ERROR ANALYSIS

- [TODO] Correct Predictions
- [TODO] Incorrect Predictions
- [TODO] Cattle → Buffalo Errors
- [TODO] Buffalo → Cattle Errors
- [TODO] Low-Confidence Predictions
- [TODO] Difficult Angles
- [TODO] Difficult Lighting
- [TODO] Background Problems
- [TODO] Occlusion
- [TODO] Mislabelled Data Investigation

## 12. MODEL INTERPRETABILITY

- [TODO] Why Did the Model Predict Cattle?
- [TODO] Why Did the Model Predict Buffalo?
- [TODO] Grad-CAM / Attention Visualization
- [TODO] Important Visual Regions
- [TODO] Background Bias Detection

## 13. MODEL TESTING

- [TODO] Known Dataset Images
- [TODO] Completely Unseen Images
- [TODO] Internet Images
- [TODO] Different Backgrounds
- [TODO] Different Lighting
- [TODO] Different Angles
- [TODO] Partial Animal Images
- [TODO] Multiple Animals
- [TODO] Difficult / Edge Cases

## 14. INFERENCE SYSTEM

- [TODO] Load Trained Model
- [TODO] Input Image
- [TODO] Preprocessing
- [TODO] Prediction
- [TODO] Confidence Score
- [TODO] Decision Threshold
- [TODO] Result: Cattle / Buffalo

## 15. WEB APPLICATION

### HOME
- [TODO] Project Name
- [TODO] Short Description
- [TODO] Start Classification

### CLASSIFY
- [TODO] Upload Image
- [TODO] Drag & Drop
- [TODO] Camera Capture
- [TODO] Image Preview
- [TODO] Predict Button

### RESULT
- [TODO] Predicted Class
- [TODO] Confidence
- [TODO] Uploaded Image
- [TODO] Prediction Explanation
- [TODO] Try Another Image

### ABOUT
- [TODO] About Project
- [TODO] Dataset
- [TODO] Model
- [TODO] Technology Stack

### MODEL INFO
- [TODO] Model Architecture
- [TODO] Training Data
- [TODO] Evaluation Metrics
- [TODO] Limitations

## 16. BACKEND

### API
- [TODO] `/predict`
- [TODO] `/health`
- [TODO] `/model-info`

- [TODO] Image Validation
- [TODO] Image Preprocessing
- [TODO] Model Inference
- [TODO] Confidence Calculation
- [TODO] Error Handling

## 17. DEPLOYMENT

- [TODO] Local Deployment
- [TODO] Backend Hosting
- [TODO] Frontend Hosting
- [TODO] Model Hosting
- [TODO] Environment Variables
- [TODO] Requirements
- [TODO] Production Testing

## 18. PERFORMANCE

- [TODO] Model Accuracy
- [TODO] Inference Speed
- [TODO] Model Size
- [TODO] Memory Usage
- [TODO] CPU Performance
- [TODO] GPU Performance
- [TODO] Mobile Feasibility

## 19. DOCUMENTATION

- [TODO] README
- [TODO] Installation Guide
- [TODO] Dataset Documentation
- [TODO] Training Guide
- [TODO] Evaluation Report
- [TODO] API Documentation
- [TODO] User Guide
- [TODO] Project Report

## 20. RESEARCH / REPORT

- [TODO] Abstract
- [TODO] Introduction
- [TODO] Literature Review
- [TODO] Problem Statement
- [TODO] Objectives
- [TODO] Dataset
- [TODO] Methodology
- [TODO] Preprocessing
- [TODO] Model Architecture
- [TODO] Training
- [TODO] Evaluation
- [TODO] Results
- [TODO] Error Analysis
- [TODO] Limitations
- [TODO] Conclusion
- [TODO] Future Work

## 21. FUTURE EXPANSION

- [TODO] Breed Classification
- [TODO] Multiple Animal Detection
- [TODO] Mobile Application
- [TODO] Offline Inference
- [TODO] Disease Detection
- [TODO] Animal Counting
- [TODO] Individual Animal Recognition
- [TODO] Livestock Management System

## Execution order

We will work strictly in dependency order and test each stage before moving forward:

1. Project foundation + master tracker
2. Project overview documentation
3. Dataset statistics/documentation completion
4. Remaining dataset investigation + cleaning verification
5. Preprocessing pipeline
6. Augmentation + EDA
7. Baseline model
8. Transfer-learning candidates
9. Training + fine-tuning
10. Evaluation
11. Error analysis + interpretability
12. Inference system
13. Backend API
14. Web application
15. Integration testing
16. Deployment
17. Performance benchmarking
18. Final documentation/research report
19. Future expansion planning
