import { describe, expect, it } from 'vitest'
import sharp from 'sharp'
import { POST } from '../app/api/predict/route'
import { GET } from '../app/api/model/route'
import { MAX_IMAGE_BYTES } from '../lib/classifier-contract'
import { MAX_REQUEST_BYTES } from '../lib/read-upload'
import { decodeImage } from '../ml/inference/decode-image'

function upload(file?: File) {
  const form = new FormData()
  if (file) form.append('image', file)
  return new Request('http://localhost/api/predict', { method: 'POST', body: form })
}

async function fixture(format: 'png' | 'jpeg' | 'webp' = 'png', width = 64) {
  // Synthetic pixels exercise decoding only; these are not animal data or evaluation evidence.
  const bytes = await sharp({ create: { width, height: 64, channels: 3, background: '#809080' } }).toFormat(format).toBuffer()
  return new File([new Uint8Array(bytes)], `validation.${format}`, { type: `image/${format}` })
}

describe('prediction API with actual multipart parsing and sharp decoding', () => {
  it('reports model status without metrics', async () => {
    expect(await GET().json()).toMatchObject({ available: false, metrics: null, state: 'pending_dataset' })
  })
  it('rejects missing files', async () => {
    const response = await POST(upload())
    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({ error: { code: 'NO_IMAGE' } })
  })
  it.each(['png', 'jpeg', 'webp'] as const)('validates %s and returns an honest structured 503', async format => {
    const response = await POST(upload(await fixture(format)))
    expect(response.status).toBe(503)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.json()).toEqual({ error: { code: 'MODEL_UNAVAILABLE', message: 'Model training pending dataset access' } })
  })
  it('fully decodes RGB image data for the adapter', async () => {
    const decoded = await decodeImage(await fixture())
    expect(decoded).toMatchObject({ width: 64, height: 64, channels: 3 })
    expect(decoded.pixels.length).toBe(64 * 64 * 3)
  })
  it('rejects corrupt data instead of treating it as an image', async () => {
    const response = await POST(upload(new File(['not a png'], 'corrupt.png', { type: 'image/png' })))
    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({ error: { code: 'INVALID_IMAGE' } })
  })
  it('rejects file content that disagrees with its MIME type', async () => {
    const png = await fixture()
    const response = await POST(upload(new File([await png.arrayBuffer()], 'wrong.jpg', { type: 'image/jpeg' })))
    expect(response.status).toBe(400)
  })
  it('rejects tiny images', async () => {
    const response = await POST(upload(await fixture('png', 10)))
    expect(await response.json()).toMatchObject({ error: { code: 'INVALID_DIMENSIONS' } })
  })
  it('rejects unsupported types', async () => {
    const response = await POST(upload(new File(['hello'], 'text.txt', { type: 'text/plain' })))
    expect(response.status).toBe(415)
  })
  it('rejects oversized files below the request limit', async () => {
    const response = await POST(upload(new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], 'large.png', { type: 'image/png' })))
    expect(response.status).toBe(413)
  })
  it('bounds streamed bodies even without Content-Length', async () => {
    const response = await POST(new Request('http://localhost/api/predict', { method: 'POST', headers: { 'content-type': 'multipart/form-data; boundary=test' }, body: new Uint8Array(MAX_REQUEST_BYTES + 1) }))
    expect(response.status).toBe(413)
  })
  it('rejects oversized declared bodies before parsing', async () => {
    const request = upload()
    request.headers.set('content-length', String(MAX_REQUEST_BYTES + 1))
    expect((await POST(request)).status).toBe(413)
  })
  it('rejects malformed multipart and JSON', async () => {
    for (const type of ['application/json', 'multipart/form-data; boundary=missing']) {
      const response = await POST(new Request('http://localhost/api/predict', { method: 'POST', headers: { 'content-type': type }, body: '{}' }))
      expect(response.status).toBe(400)
    }
  })
  it('rejects multiple images and string fields', async () => {
    const form = new FormData()
    form.append('image', await fixture())
    form.append('image', await fixture())
    const response = await POST(new Request('http://localhost/api/predict', { method: 'POST', body: form }))
    expect(response.status).toBe(400)
    const text = new FormData()
    text.set('image', 'not a file')
    expect((await POST(new Request('http://localhost/api/predict', { method: 'POST', body: text }))).status).toBe(400)
  })
})
