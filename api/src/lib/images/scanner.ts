import type { Prisma, Image } from '@prisma/client'

import { db } from 'src/lib/db'
import ft from 'file-type'

import { getMetadata, ImageMetadata, joinString } from 'src/lib/images/metadata'
import { S3Lib } from 'src/lib/files/s3'
import { parallel } from 'src/lib/async'
import { ACCEPTED_EXTENSIONS } from 'src/lib/images/constants'

const PARALLEL_SCANS = 5
const BYTES_RANGE = 50000

async function createImageTags(
  image: Image,
  imageMetadata: ImageMetadata,
  inceptionDate: Date
) {
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
    name: (imageMetadata.parsed.date?.capture || inceptionDate)
      .getFullYear()
      .toString(),
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
    name: imageMetadata.parsed.camera
      ? joinString([
          imageMetadata.parsed.camera.make,
          imageMetadata.parsed.camera.model,
        ])
      : 'Unknown',
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

  // keywords

  if (imageMetadata.parsed.keywords) {
    const tagGroup_keywordsInput = {
      name: 'Keywords',
    }
    const tagGroup_keywords = await db.tagGroup.upsert({
      where: tagGroup_keywordsInput,
      update: tagGroup_keywordsInput,
      create: tagGroup_keywordsInput,
    })

    for (const i in imageMetadata.parsed.keywords) {
      const keyword = imageMetadata.parsed.keywords[i]
      const tag_keywordInput = {
        name: keyword,
        tagGroupId: tagGroup_keywords.id,
      }
      const tag_keyword = await db.tag.upsert({
        where: {
          name_tagGroupId: tag_keywordInput,
        },
        update: tag_keywordInput,
        create: tag_keywordInput,
      })
      await db.tagsOnImage.create({
        data: {
          tagId: tag_keyword.id,
          imageId: image.id,
        },
      })
    }
  }
}

function getFileInceptionDate(head: Record<string, any>) {
  let inceptionDate = new Date()
  if (+head.LastModified < +inceptionDate) inceptionDate = head.LastModified

  if (
    head.Metadata?.created_at &&
    +new Date(head.Metadata.created_at) < +inceptionDate
  )
    inceptionDate = new Date(head.Metadata.created_at)

  if (
    head.Metadata?.modified_at &&
    +new Date(head.Metadata.modified_at) < +inceptionDate
  )
    inceptionDate = new Date(head.Metadata.modified_at)

  return inceptionDate
}

async function scanImage(imagePath: Prisma.ImageCreateInput['path']) {
  console.log('- scanning image', imagePath)

  const head = await S3Lib.head(imagePath)
  if (head.ContentLength === 0) {
    throw new Error('Zero byte file')
  }
  const imageBuffer = await S3Lib.get(imagePath, `bytes=0-${BYTES_RANGE}`)

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

  console.log('added image', image.path)
  return imagePath
}

export async function scanFiles() {
  console.log('Scanner script started')

  console.log('emptying db')
  await db.image.deleteMany({})
  await db.tagGroup.deleteMany({})

  console.log('Getting file list from S3...')
  const files = await S3Lib.list('test_upload')
  console.log('importing files from s3', files.length)

  const scanResult = await parallel(files, PARALLEL_SCANS, scanImage)

  console.log('Finished script')
  console.log(
    `${scanResult.successes.length} success, ${scanResult.errors.length} errors`
  )
  if (scanResult.errors.length) console.log('errors:', scanResult.errors)
}
