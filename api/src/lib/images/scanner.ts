import type { Prisma } from '@prisma/client'

import { listDirRecursive } from 'src/lib/files'
import { db } from 'src/lib/db'

import { getMetadata, parseMetadata } from 'src/lib/images/metadata'

/*
const a = await listDirRecursiveIter(path)

let b = await a.next()
while (b) {
  console.log(b)
  b = await a.next()
}
*/

export async function scanFiles() {
  const path = process.env['FILESYSTEM_FOLDER']

  const files = await listDirRecursive(path)

  console.log('emptying db')
  await db.image.deleteMany({})

  console.log('importing files', files)

  await Promise.all(
    files.map(async (imagePath: Prisma.ImageCreateInput['path']) => {
      const metadata = await getMetadata(`${path}/${imagePath}`)
      const parsedMetadata = parseMetadata(metadata)

      const record = await db.image.create({
        data: {
          path: imagePath,
          dateTaken: parsedMetadata?.CreateDate || new Date(),
          dateEdited: new Date(),
          metadataJson: JSON.stringify(metadata) || '',
        },
      })
      console.log(record.path)
    })
  )

  console.log('Finished scanning')
}
