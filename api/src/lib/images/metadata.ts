import moment from 'moment'
import { ExifImage } from 'exif'

type ImageMetadata = {
  image: object
  exif: object
  gps: object
}

type ParsedImageMetadata = {
  CreateDate?: Date
}

export async function getMetadata(path: string): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line no-new
      new ExifImage({ image: path }, (error, exifData) => {
        if (error && error.code === 'NO_EXIF_SEGMENT') {
          resolve(null)
        } else if (error) {
          reject(error)
        } else resolve(exifData)
      })
    } catch (error) {
      reject(error)
    }
  })
}

export function parseMetadata(
  metadata: ImageMetadata | null
): ParsedImageMetadata {
  if (!metadata) return null

  const parsed: ParsedImageMetadata = {}
  if (metadata.exif?.CreateDate) {
    parsed.CreateDate = moment
      .utc(metadata.exif.CreateDate, 'YYYY-MM-DD hh:mm:ss')
      .toDate()
  }

  return parsed
}
