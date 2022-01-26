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
  takenAtLat?: number
  takenAtLng?: number
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

  if (hasSome(metadata.image, ['Model', 'Make'])) {
    parsed.camera = `${metadata.image?.Make}${
      hasAll(metadata.image, ['Model', 'Make']) ? ' - ' : ''
    }${metadata.image?.Model}`
  }
  if (
    hasAll(metadata.gps, [
      'GPSLatitude',
      'GPSLatitudeRef',
      'GPSLongitude',
      'GPSLongitudeRef',
    ])
  ) {
    parsed.takenAtLat = getDMS2DD(
      metadata.gps.GPSLatitude,
      metadata.gps.GPSLatitudeRef
    )
    parsed.takenAtLng = getDMS2DD(
      metadata.gps.GPSLongitude,
      metadata.gps.GPSLongitudeRef
    )
  }

  return parsed
}

function hasAll(obj: any, props: string[]) {
  return obj && props.reduce((acc, curr) => acc && !!obj[curr], true)
}
function hasSome(obj: any, props: string[]) {
  return obj && props.reduce((acc, curr) => acc || !!obj[curr], true)
}

function getDMS2DD(l, ref) {
  let dd = l[0] + l[1] / 60 + l[2] / (60 * 60)
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1
  }
  return dd
}
