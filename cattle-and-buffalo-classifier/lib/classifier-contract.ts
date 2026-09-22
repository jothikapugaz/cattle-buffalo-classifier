export const CLASS_IDS = { cattle: 0, buffalo: 1 } as const
export type AnimalClass = keyof typeof CLASS_IDS
export type Prediction = { class: AnimalClass; confidence: number }

export const MAX_IMAGE_BYTES = 3 * 1024 * 1024
export const MAX_IMAGE_PIXELS = 20_000_000
export const MIN_IMAGE_SIDE = 32
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const MODEL_STATUS = {
  available: false,
  state: 'pending_inference_service',
  message: 'Trained MobileNetV2 is evaluated; connect the TensorFlow inference service to enable predictions.',
  architecture: 'MobileNetV2 fine-tuned',
  classes: CLASS_IDS,
  metrics: {
    testAccuracy: 0.9414,
    buffaloPrecision: 0.7255,
    buffaloRecall: 0.9367,
    buffaloF1: 0.8177,
    rocAuc: 0.9834,
    testImages: 563,
  },
} as const

export type ErrorCode =
  | 'NO_IMAGE' | 'INVALID_REQUEST' | 'FILE_TOO_LARGE' | 'UNSUPPORTED_TYPE'
  | 'INVALID_IMAGE' | 'INVALID_DIMENSIONS' | 'MODEL_UNAVAILABLE'
  | 'INFERENCE_FAILED' | 'INVALID_PREDICTION'

export class ClassifierError extends Error {
  constructor(public code: ErrorCode, message: string, public status = 400) {
    super(message)
    this.name = 'ClassifierError'
  }
}

export function validateFile(file: Pick<File, 'type' | 'size'>) {
  if (!file.size) throw new ClassifierError('INVALID_IMAGE', 'This file is empty. Choose a different image.')
  if (file.size > MAX_IMAGE_BYTES) throw new ClassifierError('FILE_TOO_LARGE', 'This image is too large. Choose an image under 3 MB.', 413)
  if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    throw new ClassifierError('UNSUPPORTED_TYPE', 'Choose a JPG, PNG, or WebP image. Other file types are not supported.', 415)
  }
}

export function validateDimensions(width: number, height: number) {
  if (width < MIN_IMAGE_SIDE || height < MIN_IMAGE_SIDE || width * height > MAX_IMAGE_PIXELS) {
    throw new ClassifierError('INVALID_DIMENSIONS', 'Choose an image at least 32 × 32 pixels and no larger than 20 megapixels.')
  }
}

export function isPrediction(value: unknown): value is Prediction {
  if (!value || typeof value !== 'object') return false
  const prediction = value as Record<string, unknown>
  return (prediction.class === 'cattle' || prediction.class === 'buffalo') &&
    typeof prediction.confidence === 'number' && Number.isFinite(prediction.confidence) &&
    prediction.confidence >= 0 && prediction.confidence <= 1
}
