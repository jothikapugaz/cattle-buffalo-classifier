import { ClassifierError, isPrediction, MODEL_STATUS, type Prediction } from '../../lib/classifier-contract'
import type { ValidatedImage } from './decode-image'

export interface ClassifierAdapter {
  predict(image: ValidatedImage): Promise<Prediction>
}

export async function loadClassifier(): Promise<ClassifierAdapter | null> {
  // Fail closed: no authorized dataset, trained artifact, or evaluated model is available.
  return null
}

export async function classifyImage(image: ValidatedImage): Promise<Prediction> {
  const classifier = await loadClassifier()
  if (!classifier) throw new ClassifierError('MODEL_UNAVAILABLE', MODEL_STATUS.message, 503)
  try {
    const prediction = await classifier.predict(image)
    if (!isPrediction(prediction)) throw new ClassifierError('INVALID_PREDICTION', 'The model returned an invalid result. Please try again later.', 502)
    return prediction
  } catch (cause) {
    if (cause instanceof ClassifierError) throw cause
    throw new ClassifierError('INFERENCE_FAILED', 'The model couldn’t analyze this image. Please try again.', 500)
  }
}
