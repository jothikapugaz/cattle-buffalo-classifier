import { describe, expect, it } from 'vitest'
import { CLASS_IDS, MAX_IMAGE_BYTES, isPrediction, validateDimensions, validateFile } from '../lib/classifier-contract'
import { loadClassifier, classifyImage } from '../ml/inference/classifier'

describe('image upload contract', () => {
  it('keeps explicit class IDs rather than alphabetical order', () => {
    expect(CLASS_IDS).toEqual({ cattle: 0, buffalo: 1 })
  })
  it.each(['image/jpeg', 'image/png', 'image/webp'])('accepts the supported MIME type %s', type => {
    expect(() => validateFile({ type, size: 100 })).not.toThrow()
  })
  it('rejects empty, oversized, and unsupported files', () => {
    expect(() => validateFile({ type: 'image/png', size: 0 })).toThrow('empty')
    expect(() => validateFile({ type: 'image/png', size: MAX_IMAGE_BYTES + 1 })).toThrow('too large')
    expect(() => validateFile({ type: 'image/svg+xml', size: 100 })).toThrow('not supported')
  })
  it('rejects unsafe dimensions', () => {
    expect(() => validateDimensions(31, 32)).toThrow()
    expect(() => validateDimensions(5000, 5000)).toThrow()
    expect(() => validateDimensions(640, 480)).not.toThrow()
  })
})

describe('prediction response guard', () => {
  it.each([null, {}, { class: 'unlabelled', confidence: 0.5 }, { class: 'cattle', confidence: NaN }, { class: 'buffalo', confidence: 1.1 }, { class: 'cattle', confidence: -1 }, { class: 'buffalo', confidence: '0.5' }])('rejects invalid output %j', value => {
    expect(isPrediction(value)).toBe(false)
  })
  it('recognizes both valid schema shapes, not model accuracy', () => {
    for (const label of Object.keys(CLASS_IDS)) {
      expect(isPrediction({ class: label, confidence: 0 })).toBe(true)
      expect(isPrediction({ class: label, confidence: 1 })).toBe(true)
    }
  })
})

describe('real pending model behavior', () => {
  it('does not fabricate or load nonexistent weights', async () => {
    expect(await loadClassifier()).toBeNull()
  })
  it('fails closed instead of returning a prediction', async () => {
    await expect(classifyImage({ pixels: new Uint8Array(32 * 32 * 3), width: 32, height: 32, channels: 3 })).rejects.toMatchObject({ code: 'MODEL_UNAVAILABLE', status: 503 })
  })
})
