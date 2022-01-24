import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

// Manually seed via `yarn rw prisma db seed`
// Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
// Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster

export default async () => {
  try {
    await db.tag.deleteMany({})
    await db.tagGroup.deleteMany({})

    const data_tagGroup: Prisma.TagGroupCreateInput = { name: 'Person' }
    const data_tagGroup2: Prisma.TagGroupCreateInput = { name: 'Places' }

    const record_tagGroup = await db.tagGroup.create({ data: data_tagGroup })
    const record_tagGroup2 = await db.tagGroup.create({
      data: data_tagGroup2,
    })

    const data_tags: Prisma.TagGroupCreateInput[] = [
      { name: 'Alice' },
      { name: 'Bob' },
    ]
    const data_tags2: Prisma.TagGroupCreateInput[] = [
      { name: 'Paris' },
      { name: 'Bordeaux' },
    ]

    await Promise.all(
      data_tags.map(async (data_tag: Prisma.TagCreateInput) => {
        const record_tag = await db.tag.create({
          data: {
            ...data_tag,
            tagGroupId: record_tagGroup.id,
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
            tagGroupId: record_tagGroup2.id,
          },
        })
        console.log(record_tag)
      })
    )
  } catch (error) {
    console.error(error)
  }
}
