import { TagCategoryType } from '@prisma/client'
import { db } from 'api/src/lib/db'

// Manually seed via `yarn rw prisma db seed`
// Seeds automatically with `yarn rw prisma migrate dev` and `yarn rw prisma migrate reset`
// Note: if using PostgreSQL, using `createMany` to insert multiple records is much faster

export default async () => {
  try {
    await db.tagCategory.createMany({
      data: [
        {
          name: 'Persons',
          type: TagCategoryType.Person,
        },
      ],
    })
  } catch (error) {
    console.error(error)
  }
}
