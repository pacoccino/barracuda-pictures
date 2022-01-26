import moment from 'moment'
import { ExifImage } from 'exif'

type ImageMetadata = {
  image?: any
  exif?: any
  gps?: any
}

type ParsedImageMetadata = {
  dateTaken?: Date
  camera?: string
}

export async function getMetadata(
  path: Buffer | string
): Promise<ImageMetadata> {
  return new Promise((resolve, reject) => {
    try {
      // eslint-disable-next-line no-new
      new ExifImage({ image: path }, (error, exifData) => {
        if (error && error.code === 'NO_EXIF_SEGMENT') {
          resolve({})
        } else if (error) {
          reject(error)
        } else resolve(JSON.parse(JSON.stringify(exifData)))
      })
    } catch (error) {
      reject(error)
    }
  })
}

export function parseMetadata(metadata: ImageMetadata): ParsedImageMetadata {
  const parsed: ParsedImageMetadata = {}

  if (!metadata) return parsed

  if (metadata.exif?.CreateDate) {
    parsed.dateTaken = moment
      .utc(metadata.exif.CreateDate, 'YYYY-MM-DD hh:mm:ss')
      .toDate()
  }

  if (metadata.image?.Model || metadata.image?.Make) {
    parsed.camera = `${metadata.image?.Make}${
      metadata.image?.Model && metadata.image?.Make ? ' - ' : ''
    }${metadata.image?.Model}`
  }

  return parsed
}
