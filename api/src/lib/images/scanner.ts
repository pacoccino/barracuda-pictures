import type { Prisma } from '@prisma/client'

import { db } from 'src/lib/db'

import { getMetadata, parseMetadata } from 'src/lib/images/metadata'
import { S3Lib } from 'src/lib/s3'

export async function scanFiles() {
  console.log('Scanner script started')

  const files = await S3Lib.list()

  console.log('emptying db')
  await db.image.deleteMany({})

  console.log('importing files from s3', files.length)

  const cameraInput = {
    name: 'Camera',
  }
  const tagGroup_camera = await db.tagGroup.upsert({
    where: cameraInput,
    update: cameraInput,
    create: cameraInput,
  })

  await Promise.all(
    files.map(async (imagePath: Prisma.ImageCreateInput['path']) => {
      const imageBuffer = await S3Lib.get(imagePath)
      const metadata = await getMetadata(imageBuffer)
      const parsedMetadata = parseMetadata(metadata)

      const image = await db.image.create({
        data: {
          path: imagePath,
          dateTaken: parsedMetadata.dateTaken,
          metadataJson: parsedMetadata.json,
        },
      })

      if (parsedMetadata.camera) {
        const tagInput = {
          name: parsedMetadata.camera,
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
      }
      console.log('added image', image.path)
    })
  )

  console.log('Finished scanning')
}
