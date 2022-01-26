import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

import { getMetadata, parseMetadata } from 'src/lib/images/metadata'
import { S3Lib } from 'src/lib/s3'

async function scanImage(imagePath: Prisma.ImageCreateInput['path']) {
  const imageBuffer = await S3Lib.get(imagePath)
  const metadata = await getMetadata(imageBuffer)
  const parsedMetadata = parseMetadata(metadata)

  // Create Image

  const image = await db.image.create({
    data: {
      path: imagePath,
      dateTaken: parsedMetadata.dateTaken,
      metadata,
      takenAtLng: parsedMetadata.takenAtLng,
      takenAtLat: parsedMetadata.takenAtLat,
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
}

export async function scanFiles() {
  console.log('Scanner script started')

  const files = await S3Lib.list()

  console.log('emptying db')
  await db.image.deleteMany({})
  await db.tagGroup.deleteMany({})

  console.log('importing files from s3', files.length)

  await Promise.all(files.map(scanImage))

  console.log('Finished scanning')
}
