import { Buckets } from 'src/lib/files/s3'
import { getMiniature } from 'src/lib/images/miniature'

export async function uploadImage(path, imageBuffer: Buffer, metadata, mime) {
  await Buckets.photos.put(path, imageBuffer, metadata, mime)
  const miniature = await getMiniature(imageBuffer)
  await Buckets.miniatures.put(path, miniature.buffer, null, miniature.mime)
}
