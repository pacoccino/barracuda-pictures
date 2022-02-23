import type { Prisma } from '@prisma/client'
import { logger as parentLogger } from 'src/lib/logger'
import { db } from 'src/lib/db'
import ft from 'file-type'

import { getMetadata } from 'src/lib/images/metadata'
import { Buckets } from 'src/lib/files/s3'
import { parallel } from 'src/lib/async'
import { ACCEPTED_EXTENSIONS } from 'src/lib/images/constants'
import { getMiniature } from 'src/lib/images/miniature'
import { createImageTags } from './tagger'

const logger = parentLogger.child({ module: 'SCANNER' })

const PARALLEL_SCANS = 5

enum TaskResult {
  EXISTING = 'EXISTING',
  UNSUPPORTED = 'UNSUPPORTED',
  UPLOADED = 'UPLOADED',
  NO_DATE = 'NO_DATE',
}

type Task = string

async function scanImage(imagePath: Prisma.ImageCreateInput['path']) {
  logger.debug(`scanning image ${imagePath}`)

  const imageExisting = await db.image.findUnique({
    where: {
      path: imagePath,
    },
  })
  if (imageExisting) return TaskResult.EXISTING

  const head = await Buckets.photos.head(imagePath)
  if (head.ContentLength === 0) {
    throw new Error('Zero byte file')
  }
  const imageBuffer = await Buckets.photos.get(imagePath)

  const fileType = await ft.fromBuffer(imageBuffer)
  if (!fileType || ACCEPTED_EXTENSIONS.indexOf(fileType.ext) === -1) {
    return TaskResult.UNSUPPORTED
    // throw new Error(
    //   `Unsupported file type for ${imagePath} ${fileType?.ext || ''}`
    // )
  }

  const imageMetadata = await getMetadata(imageBuffer)

  if (!imageMetadata.parsed.date) {
    return TaskResult.NO_DATE
  }

  const image = await db.image.create({
    data: {
      path: imagePath,
      dateTaken: imageMetadata.parsed.date.capture,
      metadata: imageMetadata.raw,
    },
  })

  await createImageTags(image, imageMetadata)

  const miniature = await getMiniature(imageBuffer)
  await Buckets.miniatures.put(
    imagePath,
    miniature.buffer,
    null,
    miniature.mime
  )

  logger.debug(`added image ${image.path} ${image.id}`)

  return TaskResult.UPLOADED
}

export async function scanFiles(_args = {}) {
  logger.info('Scanner script started')

  logger.debug('Getting file list from S3...')
  const files = await Buckets.photos.list()
  logger.debug({ filesLength: files.length }, 'importing files from s3')

  const parallelActions = parallel<Task, TaskResult>(
    files.slice(0, 8),
    PARALLEL_SCANS,
    scanImage,
    true
  )

  const scanResult = await parallelActions.finished()

  if (scanResult.errors.length)
    logger.error({ errors: scanResult.errors }, 'errors:')

  const uploaded = scanResult.successes.filter(
    (s) => s.result === TaskResult.UPLOADED
  ).length
  const existing = scanResult.successes.filter(
    (s) => s.result === TaskResult.EXISTING
  ).length
  const unsupported = scanResult.successes.filter(
    (s) => s.result === TaskResult.UNSUPPORTED
  ).length

  const no_date = scanResult.successes.filter(
    (s) => s.result === TaskResult.NO_DATE
  )

  logger.info(
    `Scan finished: ${uploaded} added, ${existing} existing, ${unsupported} unsupported, ${scanResult.errors.length} errors`
  )
  if (no_date.length)
    logger.error({ no_date }, `Image without date: ${no_date.length}`)
}
