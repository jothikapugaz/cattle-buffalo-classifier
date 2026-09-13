import { ClassifierError, MAX_IMAGE_BYTES } from './classifier-contract'

export const MAX_REQUEST_BYTES = MAX_IMAGE_BYTES + 64 * 1024

export async function readUpload(request: Request): Promise<File> {
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('multipart/form-data;')) {
    throw new ClassifierError('INVALID_REQUEST', 'Send one image using a multipart form.')
  }
  const length = request.headers.get('content-length')
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_REQUEST_BYTES)) {
    throw new ClassifierError('FILE_TOO_LARGE', 'This request is too large. Choose one image under 3 MB.', 413)
  }
  if (!request.body) throw new ClassifierError('NO_IMAGE', 'Choose an image before analyzing.')
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      total += value.byteLength
      if (total > MAX_REQUEST_BYTES) {
        await reader.cancel()
        throw new ClassifierError('FILE_TOO_LARGE', 'This request is too large. Choose one image under 3 MB.', 413)
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  const body = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength }
  let form: FormData
  try {
    form = await new Response(body, { headers: { 'content-type': contentType } }).formData()
  } catch {
    throw new ClassifierError('INVALID_REQUEST', 'This upload could not be read. Choose your image and try again.')
  }
  const images = form.getAll('image')
  if (!images.length) throw new ClassifierError('NO_IMAGE', 'Choose an image before analyzing.')
  if (images.length !== 1 || [...form.keys()].some(key => key !== 'image')) {
    throw new ClassifierError('INVALID_REQUEST', 'Send exactly one image at a time.')
  }
  const image = images[0]
  if (!(image instanceof File)) throw new ClassifierError('INVALID_REQUEST', 'The upload must contain an image file, not text.')
  return image
}
