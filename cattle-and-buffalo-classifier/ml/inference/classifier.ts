import sharp from 'sharp'
import { ClassifierError, isPrediction, MODEL_STATUS, type Prediction } from '../../lib/classifier-contract'
import type { ValidatedImage } from './decode-image'

export interface ClassifierAdapter {
  predict(image: ValidatedImage): Promise<Prediction>
}

let cachedClassifier: ClassifierAdapter | null = null

class RemoteClassifierAdapter implements ClassifierAdapter {
  constructor(private readonly baseUrl: string) {}

  async predict(image: ValidatedImage): Promise<Prediction> {
    // Keep the upload safely below the inference service's compressed-file limit.
    // The model itself receives 224x224 RGB pixels, so retaining a very large
    // browser upload provides no useful inference benefit.
    const upload = await sharp(image.pixels, {
      raw: { width: image.width, height: image.height, channels: 3 },
    })
      .resize({
        width: 1280,
        height: 1280,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer()

    const body = new FormData()
    body.append('file', new Blob([upload], { type: 'image/jpeg' }), 'image.jpg')

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 20_000)

    try {
      const response = await fetch(
        new URL('/predict', this.baseUrl.replace(/\/$/, '') + '/').toString(),
        { method: 'POST', body, signal: controller.signal, cache: 'no-store' },
      )

      let payload: unknown
      try {
        payload = await response.json()
      } catch {
        throw new ClassifierError('INFERENCE_FAILED', 'The model service returned an unreadable response.', 502)
      }

      if (!response.ok) {
        if (response.status === 503) {
          throw new ClassifierError('MODEL_UNAVAILABLE', MODEL_STATUS.message, 503)
        }
        throw new ClassifierError('INFERENCE_FAILED', 'The model service could not analyze this image.', 502)
      }

      if (!isPrediction(payload)) {
        throw new ClassifierError('INVALID_PREDICTION', 'The model returned an invalid result.', 502)
      }

      return payload
    } catch (cause) {
      if (cause instanceof ClassifierError) throw cause
      if (cause instanceof DOMException && cause.name === 'AbortError') {
        throw new ClassifierError('INFERENCE_FAILED', 'The model service took too long to respond.', 504)
      }
      throw new ClassifierError('INFERENCE_FAILED', 'The model service could not be reached.', 502)
    } finally {
      clearTimeout(timeout)
    }
  }
}

export async function loadClassifier(): Promise<ClassifierAdapter | null> {
  if (cachedClassifier) return cachedClassifier

  const serviceUrl = process.env.MODEL_SERVICE_URL?.trim()
  if (!serviceUrl) return null

  try {
    new URL(serviceUrl)
  } catch {
    throw new ClassifierError('MODEL_UNAVAILABLE', 'The model service URL is invalid.', 503)
  }

  cachedClassifier = new RemoteClassifierAdapter(serviceUrl)
  return cachedClassifier
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
