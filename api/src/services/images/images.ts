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
  take,
  skip,
  sorting,
  cursor,
}: QueryimagesArgs) => {
  const query: Prisma.ImageFindManyArgs = {
    orderBy: [],
  }

  if (take === undefined) {
    query.take = 10
  } else if (take > 0) {
    query.take = take
  }

  if (skip !== undefined) {
    query.skip = skip
  }

  if (cursor) {
    query.cursor = {
      id: cursor,
    }
  }

  query.orderBy.push({
    dateTaken: sorting?.dateTaken || 'desc',
  })
  query.orderBy.push({
    id: 'desc',
  })

  if (filter) {
    query.where = {}

    if (filter.tagLists && filter.tagLists.length > 0) {
      query.where = {
        AND: filter.tagLists.map((tagGrouped) => ({
          [tagGrouped.condition]: tagGrouped.tagIds.map((tagId) => ({
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

    if (filter.dateRange) {
      query.where.dateTaken = {}
      if (filter.dateRange.from) {
        query.where.dateTaken.gte = filter.dateRange.from
      }
      if (filter.dateRange.to) {
        query.where.dateTaken.lte = filter.dateRange.to
      }
    }
  }

  return db.image.findMany(query)
}

export const moreImages = images
