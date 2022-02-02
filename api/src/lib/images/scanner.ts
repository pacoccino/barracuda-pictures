import type { Prisma } from '@prisma/client'

import async from 'async'
import { db } from 'src/lib/db'
import ft from 'file-type'

import { getMetadata, parseMetadata } from 'src/lib/images/metadata'
import { S3Lib } from 'src/lib/files/s3'

const PARALLEL_SCANS = 5
const ACCEPTED_EXTENSIONS = ['jpg', 'png', 'webp', 'tif']

async function scanImage(imagePath: Prisma.ImageCreateInput['path']) {
  console.log('- scanning image', imagePath)
  const imageBuffer = await S3Lib.get(imagePath)

  const fileType = await ft.fromBuffer(imageBuffer)
  if (!fileType || ACCEPTED_EXTENSIONS.indexOf(fileType.ext) === -1) {
    throw new Error(
      `Unsupported file type for ${imagePath} ${fileType?.ext || ''}`
    )
  }

  const metadata = await getMetadata(imageBuffer, fileType)
  const parsedMetadata = parseMetadata(metadata)

  // Create Image

  const image = await db.image.create({
    data: {
      path: imagePath,
      dateTaken: parsedMetadata.dateTaken,
      takenAtLng: parsedMetadata.takenAtLng,
      takenAtLat: parsedMetadata.takenAtLat,
      metadata,
    },
  })

  // Create Tags

  // Year
  const tagGroup_dateInput = {
    name: 'Year',
  }
  const tagGroup_date = await db.tagGroup.upsert({
    where: tagGroup_dateInput,
    update: tagGroup_dateInput,
    create: tagGroup_dateInput,
  })
  const tag_dateInput = {
    name: parsedMetadata.dateTaken
      ? parsedMetadata.dateTaken.getFullYear().toString()
      : 'Unknown',
    tagGroupId: tagGroup_date.id,
  }
  const tag_date = await db.tag.upsert({
    where: {
      name_tagGroupId: tag_dateInput,
    },
    update: tag_dateInput,
    create: tag_dateInput,
  })
  await db.tagsOnImage.create({
    data: {
      tagId: tag_date.id,
      imageId: image.id,
    },
  })

  // Camera

  const tagGroup_cameraInput = {
    name: 'Camera',
  }
  const tagGroup_camera = await db.tagGroup.upsert({
    where: tagGroup_cameraInput,
    update: tagGroup_cameraInput,
    create: tagGroup_cameraInput,
  })
  const tagInput = {
    name: parsedMetadata.camera || 'Unknown',
    tagGroupId: tagGroup_camera.id,
  }
  await db.tagsOnImage.create({
    data: {
      tag: {
        connectOrCreate: {
          create: tagInput,
          where: {
            name_tagGroupId: tagInput,
          },
        },
      },
      image: {
        connect: {
          id: image.id,
        },
      },
    },
  })
  console.log('added image', image.path)
  return true
}

async function iterateOverFiles(files, fn) {
  const results = await async.mapLimit(files, PARALLEL_SCANS, async.reflect(fn))
  const errors = results.reduce(
    (acc, curr) => (curr.error ? acc.concat(curr.error) : acc),
    []
  )
  const successes = results.reduce(
    (acc, curr) => (curr.value ? acc.concat(curr.value) : acc),
    []
  )
  return {
    errors,
    successes,
  }
}

export async function scanFiles() {
  console.log('Scanner script started')

  console.log('emptying db')
  await db.image.deleteMany({})
  await db.tagGroup.deleteMany({})

  console.log('Getting file list from S3...')
  const files = await S3Lib.list()
  console.log('importing files from s3', files.length)

  const scanResult = await iterateOverFiles(files, scanImage)

  console.log('Finished scanning')
  console.log(
    `${scanResult.successes.length} success, ${scanResult.errors.length} errors`
  )
  console.log(scanResult.errors)
}
