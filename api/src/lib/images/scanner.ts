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

  await Promise.all(
    files.map(async (imagePath: Prisma.ImageCreateInput['path']) => {
      const imageBuffer = await S3Lib.get(imagePath)
      const metadata = await getMetadata(imageBuffer)
      const parsedMetadata = parseMetadata(metadata)

      const record = await db.image.create({
        data: {
          path: imagePath,
          dateTaken: parsedMetadata?.CreateDate || new Date(),
          dateEdited: new Date(),
          metadataJson: JSON.stringify(metadata) || '',
        },
      })
      console.log('added image', record.path)
    })
  )

  console.log('Finished scanning')
}
