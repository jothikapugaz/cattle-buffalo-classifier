# Cattle-Buffalo Classifier — Project Overview

## Problem Statement

Distinguishing cattle from buffalo from an image can be difficult when the animals are viewed from different angles, under different lighting conditions, against varied backgrounds, or with partial occlusion. A computer-vision classifier can learn visual patterns from labelled images and provide an automated two-class prediction.

## Project Objective

Build, evaluate, and deploy an image-classification system that predicts whether an input image contains a **cattle** or a **buffalo**. The project will cover the complete machine-learning lifecycle: dataset investigation and cleaning, preprocessing, augmentation, model development, training, evaluation, error analysis, interpretability, inference, backend API, and web application deployment.

## Why Cattle vs Buffalo Classification?

Cattle and buffalo are visually similar in many photographs, while their physical appearance can vary substantially across breeds, ages, poses, environments, and image conditions. This makes the problem useful as a practical computer-vision classification task and provides a clear binary classification target for measuring model behaviour.

## Real-World Use Case

A lightweight classifier could be used as a supporting component in livestock-related software, educational tools, image-analysis workflows, or future livestock-management systems. The classifier is intended as an assistive computer-vision component, not as a replacement for expert animal identification.

## Scope

The initial system is limited to two classes:

- Cattle
- Buffalo

The project includes:

- dataset quality investigation
- reproducible preprocessing and augmentation
- baseline and transfer-learning experiments
- quantitative model evaluation
- difficult-case and error analysis
- model interpretability
- image inference with confidence
- a backend prediction API
- a browser-based classification interface
- deployment and performance testing

## Limitations

The model's performance will depend on the quality, diversity, and representativeness of the training data. Predictions may become less reliable for images with unusual viewpoints, severe occlusion, poor lighting, multiple animals, strong background distractions, or visual characteristics not represented in the training data.

Accuracy, precision, recall, F1 score, ROC-AUC, and other metrics will only be reported after the corresponding experiments are actually run. No performance number will be assumed or invented in the documentation.

## Future Scope

Potential extensions include breed classification, multiple-animal detection, mobile inference, offline inference, disease-related visual analysis, animal counting, individual animal recognition, and a broader livestock-management platform.

## Current Dataset State

The current verified project state includes a final Roboflow classification export containing **5,651 images** after three visually poor training images were removed. The final export contains the two target classes, `cattle` and `buffalo`. Duplicate and image-integrity audits found no exact duplicates/leakage or corrupt/unreadable images in the audited data.

Detailed dataset statistics that require direct counting from the final dataset are intentionally left for the dataset-statistics task rather than guessed here.
