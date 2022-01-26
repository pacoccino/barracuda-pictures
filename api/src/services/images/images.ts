import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

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

export const images = ({ filter, limit, skip, sorting }) => {
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

    if (filter.tagIds && filter.tagIds.length > 0) {
      query.where.tagsOnImages = {
        some: {
          OR: filter.tagIds.map((tagId) => ({
            tagId,
          })),
        },
      }
    }
  }

  return db.image.findMany(query)
}
