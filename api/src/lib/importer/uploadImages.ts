import { Buckets } from 'src/lib/files/s3'
import { getMiniature } from 'src/lib/images/miniature'

export async function uploadImage(
  path,
  imageBuffer: Buffer,
  metadata: any,
  mime: string,
  reupload = false
) {
  const headPhoto = await Buckets.photos.head(path)
  if (reupload || !headPhoto)
    await Buckets.photos.put(path, imageBuffer, metadata, mime)
}

export async function uploadImageMiniatures(path, imageBuffer: Buffer) {
  const headMiniature = await Buckets.miniatures.head(path)
  if (!headMiniature) {
    const miniature = await getMiniature(imageBuffer)
    await Buckets.miniatures.put(path, miniature.buffer, null, miniature.mime)
  }
}

export async function isImageUploaded(path: string) {
  const headPhoto = await Buckets.photos.head(path)
  const headMiniature = await Buckets.miniatures.head(path)
  return !!headMiniature && !!headPhoto
}
