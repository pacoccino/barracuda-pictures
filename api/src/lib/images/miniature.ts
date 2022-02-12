import sharp from 'sharp'
import { MINIATURE_HEIGHT, MINIATURE_QUALITY } from 'src/lib/images/constants'

type Miniature = {
  buffer: Buffer
  mime: string
}
export async function getMiniature(imageBuffer: Buffer): Promise<Miniature> {
  const sharpThumbnail = await sharp(imageBuffer)
    .resize({
      height: MINIATURE_HEIGHT,
    })
    .webp({
      quality: MINIATURE_QUALITY,
    })
    .toBuffer()

  return {
    buffer: sharpThumbnail,
    mime: 'image/webp',
  }
}
