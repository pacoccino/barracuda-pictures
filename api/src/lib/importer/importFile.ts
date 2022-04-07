import fpath from 'path'
import { open } from 'src/lib/files/fs'
import ft from 'file-type'
import S3Path from 'src/lib/files/S3Path'
import { db } from 'src/lib/db'
import {
  isFileTypeExcluded,
  isPathExcluded,
} from 'src/lib/importer/supportedFiles'
import {
  uploadImage,
  uploadImageMiniatures,
} from 'src/lib/importer/uploadImages'
import { getMetadata } from 'src/lib/images/metadata'
import { createImageTags } from 'src/lib/importer/tagger'
import { ImportOptions } from 'src/lib/importer/importer'
import { Logger } from '@redwoodjs/api/logger'
import { Buckets } from 'src/lib/files/s3'
import s3Path from 'src/lib/files/S3Path'

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
    if (
      (importOptions.fromS3 && importOptions.filesDir) ||
      (!importOptions.fromS3 && !importOptions.filesDir)
    )
      throw new Error('invalid import options')

    let fd

    try {
      let s3path, fileSystemPath, buffer

      if (importOptions.filesDir) {
        fileSystemPath = fpath.resolve(importOptions.filesDir, path)
        s3path = S3Path.getPath(importOptions.s3Prefix, path)
      } else {
        s3path = path
      }

      logger.debug(`Importing image ${s3path} ...`)

      if (importOptions.filesDir && isPathExcluded(fileSystemPath))
        return TaskResult.EXCLUDED

      const imageExistingInDb = await db.image.findUnique({
        where: {
          path: s3path,
        },
      })
      if (imageExistingInDb) return TaskResult.EXISTING // TODO check S3 ?

      if (importOptions.filesDir) {
        fd = await open(fileSystemPath, 'r')
        buffer = await fd.readFile()
      } else {
        buffer = await Buckets.photos.get(s3path)
      }

      const fileType = await ft.fromBuffer(buffer)

      if (!fileType || isFileTypeExcluded(fileType.ext))
        return TaskResult.EXCLUDED

      const imageMetadata = await getMetadata(buffer, fileType.ext)
      if (!imageMetadata.parsed.date) {
        return TaskResult.NO_DATE
      }

      if (importOptions.filesDir) {
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
      }
      await uploadImageMiniatures(s3path, buffer)

      const image = await db.image.create({
        data: {
          path: s3path,
          dateTaken: imageMetadata.parsed.date.capture,
          metadata: imageMetadata.raw,
          rating: imageMetadata.parsed.rating,
        },
      })

      await createImageTags(image, imageMetadata)

      logger.debug(`Imported image ${s3path}`)

      return TaskResult.UPLOADED
    } finally {
      await fd?.close()
    }
  }
