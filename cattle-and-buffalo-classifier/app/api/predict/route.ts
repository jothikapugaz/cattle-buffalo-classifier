import { ClassifierError } from '@/lib/classifier-contract'
import { readUpload } from '@/lib/read-upload'
import { decodeImage } from '@/ml/inference/decode-image'
import { classifyImage } from '@/ml/inference/classifier'

export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const file = await readUpload(request)
    const image = await decodeImage(file)
    const prediction = await classifyImage(image)
    return Response.json(prediction, { headers: { 'Cache-Control': 'no-store' } })
  } catch (cause) {
    const error = cause instanceof ClassifierError
      ? cause
      : new ClassifierError('INFERENCE_FAILED', 'The image service is unavailable. Please try again later.', 500)
    return Response.json({ error: { code: error.code, message: error.message } }, {
      status: error.status,
      headers: { 'Cache-Control': 'no-store' },
    })
  }
}
