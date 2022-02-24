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

const SUPPORTED_FILE_TYPES = ['jpg', 'tif', 'heic', 'avif', 'PNG']

export async function readMetadata_exifr(
  path: Buffer | string,
  fileType: string
): Promise<ImageRawMetadata> {
  if (SUPPORTED_FILE_TYPES.includes(fileType)) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const rawMD = await exifr.parse(path, exifrOptions)
    return sanitize(rawMD || {})
  }
  return {}
}

function sanitize(j: any): any {
  return JSON.parse(JSON.stringify(j).replace(/\\u0000/g, ''))
}
