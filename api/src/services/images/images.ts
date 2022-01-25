import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const images = () => {
  return db.image.findMany()
}

export const image = ({ id }: Prisma.ImageWhereUniqueInput) => {
  return db.image.findUnique({
    where: { id },
  })
}

export const Image = {
  tagsOnImages: (_obj, { root }: ResolverArgs<ReturnType<typeof image>>) =>
    db.image.findUnique({ where: { id: root.id } }).tagsOnImages(),
}

export const imagesWithFilter = ({ filter }) => {
  const query: Prisma.ImageFindManyArgs = {
    where: {},
  }
  if (filter.tagIds.length > 0) {
    query.where.tagsOnImages = {
      some: {
        OR: filter.tagIds.map((tagId) => ({
          tagId,
        })),
      },
    }
  }
  return db.image.findMany(query)
}
