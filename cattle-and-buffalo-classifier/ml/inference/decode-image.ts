import sharp from 'sharp'
import { ClassifierError, MAX_IMAGE_PIXELS, validateDimensions, validateFile } from '../../lib/classifier-contract'

export type ValidatedImage = { pixels: Uint8Array; width: number; height: number; channels: 3 }
const MIME_FORMATS: Record<string, string> = { 'image/jpeg': 'jpeg', 'image/png': 'png', 'image/webp': 'webp' }

export async function decodeImage(file: File): Promise<ValidatedImage> {
  validateFile(file)
  try {
    const buffer = Buffer.from(await file.arrayBuffer())
    const decoder = sharp(buffer, { limitInputPixels: MAX_IMAGE_PIXELS, failOn: 'warning' })
    const metadata = await decoder.metadata()
    if (metadata.format !== MIME_FORMATS[file.type]) {
      throw new ClassifierError('INVALID_IMAGE', 'The file contents don’t match its image type. Export a new JPG, PNG, or WebP.')
    }
    if ((metadata.pages ?? 1) > 1) throw new ClassifierError('INVALID_IMAGE', 'Animated images are not supported. Choose a still photo.')
    validateDimensions(metadata.width ?? 0, metadata.height ?? 0)
    const { data, info } = await decoder.rotate().flatten({ background: '#ffffff' }).toColourspace('srgb').raw().toBuffer({ resolveWithObject: true })
    if (info.channels !== 3) throw new ClassifierError('INVALID_IMAGE', 'This image could not be converted to a supported color format.')
    return { pixels: new Uint8Array(data), width: info.width, height: info.height, channels: 3 }
  } catch (cause) {
    if (cause instanceof ClassifierError) throw cause
    throw new ClassifierError('INVALID_IMAGE', 'We couldn’t read this image. It may be damaged or exceed 20 megapixels. Try a different photo.')
  }
}
