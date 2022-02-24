import moment from 'moment'
import _ from 'lodash'
import Decimal from 'decimal.js'

type ImageRawMetadata = Record<string, Record<string, any>>

export type ImageParsedMetadata = {
  date?: {
    capture?: Date
    modified?: Date
  }
  camera?: {
    make?: string
    model?: string
    full: string
  }
  lens?: {
    make?: string
    model?: string
    full: string
  }
  gps?: {
    lat?: string
    lng?: string
  }
  settings?: {
    ISO?: number
    FocalLength?: number
    ExposureTime?: number
    ApertureValue?: number
  }
  edition?: {
    software?: string
  }
  keywords?: string[]
}

function getProp(
  object: Record<string, any> | null | undefined,
  propPaths: string[] | string
): any | null {
  if (typeof propPaths === 'string') propPaths = [propPaths]
  for (const i in propPaths) {
    const propPath = propPaths[i]
    const val = _.get(object, propPath)
    if (val) return val
  }
  return null
}

export function parseMetadata_exifr(
  rawMD: ImageRawMetadata
): ImageParsedMetadata {
  const parsed: ImageParsedMetadata = {}

  // dates
  const captureDate = getProp(rawMD, [
    'exif.CreateDate',
    'exif.DateTimeOriginal',
  ])
  if (captureDate) {
    parsed.date = {
      capture: moment.utc(captureDate, 'YYYY-MM-DD hh:mm:ss').toDate(),
    }
  }

  // keywords
  const keywords = getProp(rawMD, ['iptc.Keywords'])
  if (keywords) {
    if (typeof keywords === 'string') parsed.keywords = [keywords]
    else parsed.keywords = keywords
    parsed.keywords = parsed.keywords.filter((k) => !!k)
  }

  // camera
  if (hasSome(rawMD.ifd0, ['Model', 'Make'])) {
    parsed.camera = {
      make: rawMD.ifd0.Make,
      model: rawMD.ifd0.Model,
      full: joinString([rawMD.ifd0.Make, rawMD.ifd0.Model]),
    }
  }
  if (hasSome(rawMD.exif, ['LensMake', 'LensModel'])) {
    parsed.lens = {
      make: rawMD.exif.LensMake,
      model: rawMD.exif.LensModel,
      full: joinString([rawMD.exif.LensMake, rawMD.exif.LensModel]),
    }
  }

  // edition
  if (hasSome(rawMD.ifd0, ['Software', 'Make'])) {
    parsed.edition = {
      software: rawMD.ifd0.Software,
    }
  } else if (rawMD.xmp?.CreatorTool) {
    parsed.edition = {
      software: rawMD.xmp.CreatorTool,
    }
  }

  // Settings
  const { exif } = rawMD
  if (exif) {
    parsed.settings = {
      ISO: rawMD.exif.ISO,
    }

    if (exif.FocalLength) {
      parsed.settings.FocalLength = new Decimal(exif.FocalLength)
        .toDP(2)
        .toNumber()
    }
    if (exif.FocalLengthIn35mmFormat) {
      parsed.settings.FocalLength = new Decimal(exif.FocalLengthIn35mmFormat)
        .toDP(2)
        .toNumber()
    }
    if (exif.ExposureTime) {
      if (exif.ExposureTime >= 1) {
        parsed.settings.ExposureTime = new Decimal(exif.ExposureTime)
          .toDP(2)
          .toNumber()
      } else {
        parsed.settings.ExposureTime = new Decimal(-1)
          .div(exif.ExposureTime)
          .toDP(2)
          .toNumber()
      }
    }
    if (exif.ApertureValue) {
      parsed.settings.ApertureValue = new Decimal(exif.ApertureValue)
        .toDP(2)
        .toNumber()
    }
  }

  // GPS
  if (hasAll(rawMD.gps, ['latitude', 'longitude'])) {
    parsed.gps = {
      lat: rawMD.gps.latitude,
      lng: rawMD.gps.longitude,
    }
  } else if (
    hasAll(rawMD.gps, [
      'GPSLatitude',
      'GPSLatitudeRef',
      'GPSLongitude',
      'GPSLongitudeRef',
    ])
  ) {
    parsed.gps = {
      lat: getDMS2DD(rawMD.gps.GPSLatitude, rawMD.gps.GPSLatitudeRef),
      lng: getDMS2DD(rawMD.gps.GPSLongitude, rawMD.gps.GPSLongitudeRef),
    }
  }

  return parsed
}

function hasAll(obj: any, props: string[]) {
  return obj && props.reduce((acc, prop) => acc && !!_.has(obj, prop), true)
}
function hasSome(obj: any, props: string[]) {
  return obj && props.reduce((acc, prop) => acc || !!_.has(obj, prop), false)
}

export function getDMS2DD(l, ref) {
  let dd = l[0] + l[1] / 60 + l[2] / (60 * 60)
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1
  }
  return dd
}

export function joinString(arr: string[], joiner = ' - ') {
  return arr.filter((i) => !!i).join(joiner)
}
