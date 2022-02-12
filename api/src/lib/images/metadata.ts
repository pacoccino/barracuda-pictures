import { readMetadata_exifr } from './metadata_reader'
import { parseMetadata_exifr } from './metadata_parser'

import type { ImageRawMetadata } from './metadata_reader'
import type { ImageParsedMetadata } from './metadata_parser'

export * from './metadata_parser'

export type ImageMetadata = {
  raw: ImageRawMetadata
  parsed: ImageParsedMetadata
}

export async function getMetadata(
  path: Buffer | string
): Promise<ImageMetadata> {
  const rawMD = await readMetadata_exifr(path)
  const parsedMD = parseMetadata_exifr(rawMD)
  return {
    raw: rawMD,
    parsed: parsedMD,
  }
}
