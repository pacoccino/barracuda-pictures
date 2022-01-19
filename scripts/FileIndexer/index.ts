import type { Prisma } from '@prisma/client'

import { listDirRecursive, listDirRecursiveIter } from 'api/src/lib/files'
import { db } from 'api/src/lib/db'

import { getMetadata, parseMetadata } from 'api/src/lib/images/metadata'

export default async () => {
  const path = process.env['FILESYSTEM_FOLDER']

  const a = await listDirRecursiveIter(path)

  let b = await a.next()
  while (b) {
    console.log(b)
    b = await a.next()
  }

  return

  const files = await listDirRecursive(path)

  console.log('emptying db')
  await db.image.deleteMany({})

  console.log('importing files', files)

  await Promise.all(
    files.map(async (imagePath: Prisma.ImageCreateInput['path']) => {
      const metadata = await getMetadata(`${path}/${imagePath}`)
      const parsedMetadata = parseMetadata(metadata)

      console.log(metadata)
      const record = await db.image.create({
        data: {
          path: imagePath,
          dateTaken: parsedMetadata?.CreateDate || new Date(),
          dateEdited: new Date(),
          metadataJson: JSON.stringify(metadata) || '',
        },
      })
      console.log(record)
    })
  )
}
