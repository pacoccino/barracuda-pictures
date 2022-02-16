import type { Prisma } from '@prisma/client'
import { logger as parentLogger } from 'src/lib/logger'
import { db } from 'src/lib/db'
import ft from 'file-type'

import { getMetadata } from 'src/lib/images/metadata'
import { S3Lib } from 'src/lib/files/s3'
import { parallel } from 'src/lib/async'
import { ACCEPTED_EXTENSIONS } from 'src/lib/images/constants'
import { getMiniature } from 'src/lib/images/miniature'
import { createImageTags, getFileInceptionDate } from './tagger'

const logger = parentLogger.child({ module: 'SCANNER' })

const PARALLEL_SCANS = 5

const s3photos = new S3Lib(process.env['S3_BUCKET_PHOTOS'])
const s3miniatures = new S3Lib(process.env['S3_BUCKET_MINIATURES'])

enum TaskResult {
  EXISTING = 'EXISTING',
  UNSUPPORTED = 'UNSUPPORTED',
  UPLOADED = 'UPLOADED',
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

  const head = await s3photos.head(imagePath)
  if (head.ContentLength === 0) {
    throw new Error('Zero byte file')
  }
  const imageBuffer = await s3photos.get(imagePath)

  const fileType = await ft.fromBuffer(imageBuffer)
  if (!fileType || ACCEPTED_EXTENSIONS.indexOf(fileType.ext) === -1) {
    return TaskResult.UNSUPPORTED
    // throw new Error(
    //   `Unsupported file type for ${imagePath} ${fileType?.ext || ''}`
    // )
  }

  const imageMetadata = await getMetadata(imageBuffer)
  const inceptionDate = getFileInceptionDate(head)

  const image = await db.image.create({
    data: {
      path: imagePath,
      dateTaken: imageMetadata.parsed.date?.capture || inceptionDate,
      metadata: imageMetadata.raw,
    },
  })

  await createImageTags(image, imageMetadata, inceptionDate)

  const miniature = await getMiniature(imageBuffer)
  await s3miniatures.put(imagePath, miniature.buffer, null, miniature.mime)

  logger.debug(`added image ${image.path} ${image.id}`)

  return TaskResult.UPLOADED
}

export async function scanFiles(_args = {}) {
  logger.info('Scanner script started')

  logger.debug('Getting file list from S3...')
  const files = await s3photos.list()
  logger.debug('importing files from s3', files.length)

  const scanResult = await parallel<Task, TaskResult>(
    files,
    PARALLEL_SCANS,
    scanImage
  )

  if (scanResult.errors.length) logger.error('errors:', scanResult.errors)

  const uploaded = scanResult.successes.filter(
    (s) => s.result === TaskResult.UPLOADED
  ).length
  const existing = scanResult.successes.filter(
    (s) => s.result === TaskResult.EXISTING
  ).length
  const unsupported = scanResult.successes.filter(
    (s) => s.result === TaskResult.UNSUPPORTED
  ).length
  logger.info(
    `Scan finished: ${uploaded} added, ${existing} existing, ${unsupported} unsupported, ${scanResult.errors.length} errors`
  )
}
