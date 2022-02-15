import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'
import ft from 'file-type'

import { getMetadata } from 'src/lib/images/metadata'
import { S3Lib } from 'src/lib/files/s3'
import { parallel } from 'src/lib/async'
import { ACCEPTED_EXTENSIONS } from 'src/lib/images/constants'
import { getMiniature } from 'src/lib/images/miniature'
import { createImageTags, getFileInceptionDate } from './tagger'

const PARALLEL_SCANS = 5

const s3photos = new S3Lib(process.env['S3_BUCKET_PHOTOS'])
const s3miniatures = new S3Lib(process.env['S3_BUCKET_MINIATURES'])

enum TaskResult {
  EXISTING = 'EXISTING',
  UPLOADED = 'UPLOADED',
}

type Task = string

async function scanImage(imagePath: Prisma.ImageCreateInput['path']) {
  console.log('- scanning image', imagePath)

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
    throw new Error(
      `Unsupported file type for ${imagePath} ${fileType?.ext || ''}`
    )
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

  console.log('added image', image.path)

  return TaskResult.UPLOADED
}

export async function scanFiles(_args = {}) {
  console.log('Scanner script started')

  console.log('Getting file list from S3...')
  const files = await s3photos.list()
  console.log('importing files from s3', files.length)

  const scanResult = await parallel<Task, TaskResult>(
    files,
    PARALLEL_SCANS,
    scanImage
  )

  if (scanResult.errors.length) console.log('errors:', scanResult.errors)
  console.log(
    `${scanResult.successes.length} success, ${scanResult.errors.length} errors`
  )
  const uploaded = scanResult.successes.filter(
    (s) => s.result === TaskResult.UPLOADED
  ).length
  const existing = scanResult.successes.filter(
    (s) => s.result === TaskResult.EXISTING
  ).length
  console.log(`${uploaded} uploaded, ${existing} existing`)

  console.log('Finished script')
}
