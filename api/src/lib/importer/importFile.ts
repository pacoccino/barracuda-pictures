import fpath from 'path'
import { open } from 'src/lib/files/fs'
import ft from 'file-type'
import S3Path from 'src/lib/files/S3Path'
import { db } from 'src/lib/db'
import {
  isFileTypeExcluded,
  isPathExcluded,
} from 'src/lib/importer/supportedFiles'
import { uploadImage } from 'src/lib/importer/uploadImages'
import { getMetadata } from 'src/lib/images/metadata'
import { createImageTags } from 'src/lib/importer/tagger'

export type Task = {
  path: string
}

export enum TaskResult {
  EXISTING = 'EXISTING',
  EXCLUDED = 'EXCLUDED',
  NO_DATE = 'NO_DATE',
  UPLOADED = 'UPLOADED',
}

export const getImportWorker = ({ logger, prefix, rootDir }) =>
  async function importFile({ path }: Task) {
    let fd
    try {
      const fullPath = fpath.resolve(rootDir, path)
      logger.debug(`Uploading image ${fullPath} ...`)

      if (isPathExcluded(fullPath)) return TaskResult.EXCLUDED

      const s3path = S3Path.getPath(prefix, path)

      const imageExisting = await db.image.findUnique({
        where: {
          path: s3path,
        },
      })
      if (imageExisting) return TaskResult.EXISTING

      fd = await open(fullPath, 'r')

      const buffer = await fd.readFile()
      const fileType = await ft.fromBuffer(buffer)

      if (isFileTypeExcluded(fileType.ext)) return TaskResult.EXCLUDED

      const imageMetadata = await getMetadata(buffer)
      if (!imageMetadata.parsed.date) {
        return TaskResult.NO_DATE
      }

      const stat = await fd.stat()
      const metadata = {
        created_at: stat.birthtime.toISOString(),
        modified_at: stat.mtime.toISOString(),
      }

      await uploadImage(s3path, buffer, metadata, fileType.mime)

      const image = await db.image.create({
        data: {
          path: s3path,
          dateTaken: imageMetadata.parsed.date.capture,
          metadata: imageMetadata.raw,
        },
      })

      await createImageTags(image, imageMetadata)

      logger.debug(`uploaded image ${fullPath}`)

      return TaskResult.UPLOADED
    } finally {
      await fd?.close()
    }
  }
