import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

// Manually seed via `yarn rw prisma db seed`
// Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
// Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster

export default async () => {
  try {
    /*
    await db.tag.deleteMany({})
    await db.tagCategory.deleteMany({})

    const data_tagCategory: Prisma.TagCategoryCreateInput = { name: 'Person' }
    const data_tagCategory2: Prisma.TagCategoryCreateInput = { name: 'Places' }

    const record_tagCategory = await db.tagCategory.create({ data: data_tagCategory })
    const record_tagCategory2 = await db.tagCategory.create({
      data: data_tagCategory2,
    })

    const data_tags: Prisma.TagCategoryCreateInput[] = [
      { name: 'Alice' },
      { name: 'Bob' },
    ]
    const data_tags2: Prisma.TagCategoryCreateInput[] = [
      { name: 'Paris' },
      { name: 'Bordeaux' },
    ]

    await Promise.all(
      data_tags.map(async (data_tag: Prisma.TagCreateInput) => {
        const record_tag = await db.tag.create({
          data: {
            ...data_tag,
            tagCategoryId: record_tagCategory.id,
          },
        })
        console.log(record_tag)
      })
    )
    await Promise.all(
      data_tags2.map(async (data_tag: Prisma.TagCreateInput) => {
        const record_tag = await db.tag.create({
          data: {
            ...data_tag,
            tagCategoryId: record_tagCategory2.id,
          },
        })
        console.log(record_tag)
      })
    )
   */
  } catch (error) {
    console.error(error)
  }
}
