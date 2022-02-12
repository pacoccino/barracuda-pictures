import exifr from 'exifr'

export type ImageRawMetadata = Record<string, Record<string, any>>

const exifrOptions = {
  tiff: true,
  xmp: true,
  icc: false, // color profiles
  iptc: true,
  jfif: true,
  ihdr: true,
  exif: true,
  ifd0: true,
  ifd1: true,
  gps: true,
  interop: true,
  skip: ['aux', 'dc'],
  mergeOutput: false,
}

export async function readMetadata_exifr(
  path: Buffer | string
): Promise<ImageRawMetadata> {
  const rawMD = await exifr.parse(path, exifrOptions)
  return sanitize(rawMD)
}

function sanitize(j: any): any {
  return JSON.parse(JSON.stringify(j).replace(/\\u0000/g, ''))
}
