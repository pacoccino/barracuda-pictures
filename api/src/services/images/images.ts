import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'
import type { QueryimagesArgs } from 'types/graphql'

import { db } from 'src/lib/db'

export const image = ({ id }: Prisma.ImageWhereUniqueInput) => {
  return db.image.findUnique({
    where: { id },
  })
}

export const Image = {
  tagsOnImages: (_obj, { root }: ResolverArgs<ReturnType<typeof image>>) =>
    db.image.findUnique({ where: { id: root.id } }).tagsOnImages(),
}

export const images = ({
  filter,
  limit = 10,
  skip = 0,
  sorting,
}: QueryimagesArgs) => {
  const query: Prisma.ImageFindManyArgs = {
    take: limit,
    skip: skip,
  }
  if (sorting) {
    query.orderBy = {}
    query.orderBy.dateTaken = sorting.dateTaken
  }

  if (filter) {
    query.where = {}

    if (filter.tagsGrouped && filter.tagsGrouped.length > 0) {
      query.where = {
        AND: filter.tagsGrouped.map((tagGrouped) => ({
          [tagGrouped.andor || 'OR']: tagGrouped.tagIds.map((tagId) => ({
            tagsOnImages: {
              some: {
                tag: {
                  id: tagId,
                  tagGroupId: tagGrouped.tagGroupId,
                },
              },
            },
          })),
        })),
      }
    }
  }

  return db.image.findMany(query)
}
