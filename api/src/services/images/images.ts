import type { Prisma, Image as PImage } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'
import type {
  QueryimagesArgs,
  MutationdeleteManyImagesArgs,
  MutationdeleteManyImagesWithFilterArgs,
  MutationeditImagesBasePathArgs,
  Mutation,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { Buckets } from 'src/lib/files/s3'
import { getPath, getFileName } from 'src/lib/images/paths'

export const image = ({
  id,
}: Prisma.ImageWhereUniqueInput): Promise<PImage> => {
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
}: QueryimagesArgs): Promise<PImage[]> => {
  const query: Prisma.ImageFindManyArgs = {
    orderBy: new Array<Prisma.ImageOrderByWithRelationInput>(),
  }

  if (take === undefined) {
    query.take = 10
  } else if (take !== 0) {
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

    if (filter.path && filter.path.length > 0) {
      query.where.path = {
        contains: filter.path,
      }
    }
  }

  return db.image.findMany(query)
}

// Copy of same function to have two distinct queries so different caches on Apollo (for infinite scroll)
export const moreImages = images

export const deleteManyImages = async ({
  imageIds,
}: MutationdeleteManyImagesArgs): Promise<Mutation['deleteManyImages']> => {
  let count = 0
  for (const i in imageIds) {
    const imageId = imageIds[i]
    const image = await db.image.findUnique({
      where: {
        id: imageId,
      },
    })
    if (!image) continue
    await Buckets.photos.delete(image.path)
    await Buckets.miniatures.delete(image.path)
    await db.image.delete({
      where: {
        id: imageId,
      },
    })
    count++
  }
  return {
    count,
  }
}

export const deleteManyImagesWithFilter = async ({
  filter,
}: MutationdeleteManyImagesWithFilterArgs): Promise<
  Mutation['deleteManyImagesWithFilter']
> => {
  const imagesToApply = await images({
    filter: filter,
    take: 0,
  })

  return deleteManyImages({ imageIds: imagesToApply.map((i) => i.id) })
}

export const editImagesBasePath = async ({
  imageIds,
  basePath,
}: MutationeditImagesBasePathArgs): Promise<Mutation['editImagesBasePath']> => {
  let count = 0
  for (const i in imageIds) {
    const imageId = imageIds[i]
    const imageToEdit = await image({ id: imageId })
    if (!imageToEdit) {
      continue
    }
    const fileName = getFileName(imageToEdit.path)
    const path = getPath(basePath, fileName)
    if (path === imageToEdit.path) continue

    await db.image.update({
      where: { id: imageId },
      data: {
        path,
      },
    })
    await Buckets.photos.editKey(imageToEdit.path, path)
    await Buckets.miniatures.editKey(imageToEdit.path, path)

    count++
  }
  return {
    count,
  }
}
