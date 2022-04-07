import fpath from 'path'
import { open } from 'src/lib/files/fs'
import ft from 'file-type'
import S3Path from 'src/lib/files/S3Path'
import { db } from 'src/lib/db'
import {
  isFileTypeExcluded,
  isPathExcluded,
} from 'src/lib/importer/supportedFiles'
import { isImageUploaded, uploadImage } from 'src/lib/importer/uploadImages'
import { getMetadata } from 'src/lib/images/metadata'
import { createImageTags } from 'src/lib/importer/tagger'
import { ImportOptions } from 'src/lib/importer/importer'
import { Logger } from '@redwoodjs/api/logger'

export type Task = {
  path: string
}

export enum TaskResult {
  EXISTING = 'EXISTING',
  EXCLUDED = 'EXCLUDED',
  NO_DATE = 'NO_DATE',
  UPLOADED = 'UPLOADED',
}

export const getImportWorker = ({
  importOptions,
  logger,
}: {
  importOptions: ImportOptions
  logger: Logger
}) =>
  async function importFile({ path }: Task) {
    let fd
    try {
      const fullPath = fpath.resolve(importOptions.filesDir, path)
      logger.debug(`Importing image ${fullPath} ...`)

      if (isPathExcluded(fullPath)) return TaskResult.EXCLUDED

      const s3path = S3Path.getPath(importOptions.s3Prefix, path)

      const imageExistingInDb = await db.image.findUnique({
        where: {
          path: s3path,
        },
      })
      if (imageExistingInDb) return TaskResult.EXISTING

      fd = await open(fullPath, 'r')

      const buffer = await fd.readFile()
      const fileType = await ft.fromBuffer(buffer)

      if (!fileType || isFileTypeExcluded(fileType.ext))
        return TaskResult.EXCLUDED

      const imageMetadata = await getMetadata(buffer, fileType.ext)
      if (!imageMetadata.parsed.date) {
        return TaskResult.NO_DATE
      }

      const stat = await fd.stat()
      const s3Metadata = {
        created_at: stat.birthtime.toISOString(),
        modified_at: stat.mtime.toISOString(),
      }

      await uploadImage(
        s3path,
        buffer,
        s3Metadata,
        fileType.mime,
        importOptions.s3Reupload
      )

      const image = await db.image.create({
        data: {
          path: s3path,
          dateTaken: imageMetadata.parsed.date.capture,
          metadata: imageMetadata.raw,
          rating: imageMetadata.parsed.rating,
        },
      })

      await createImageTags(image, imageMetadata)

      logger.debug(`Imported image ${fullPath}`)

      return TaskResult.UPLOADED
    } finally {
      await fd?.close()
    }
  }
