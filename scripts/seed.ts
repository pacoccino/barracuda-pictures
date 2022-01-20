import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'

// Manually seed via `yarn rw prisma db seed`
// Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
// Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster

export default async () => {
  try {
    await db.tagGroup.deleteMany({})
    await db.tag.deleteMany({})

    const data_tagGroup: Prisma.TagGroupCreateInput = { name: 'person' }

    const record_tagGroup = await db.tagGroup.create({ data: data_tagGroup })
    console.log(record_tagGroup)

    const data_tags: Prisma.TagGroupCreateInput[] = [
      { name: 'alice' },
      { name: 'bob' },
    ]

    Promise.all(
      data_tags.map(async (data_tag: Prisma.TagCreateInput) => {
        const record_tag = await db.tag.create({
          data: {
            ...data_tag,
            groupId: record_tagGroup.id,
          },
        })
        console.log(record_tag)
      })
    )
  } catch (error) {
    console.error(error)
  }
}
