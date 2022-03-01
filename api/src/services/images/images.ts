import type { Prisma, Image as PImage } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'
import type {
  QueryimagesArgs,
  MutationdeleteManyImagesArgs,
  MutationeditImagesBasePathArgs,
  Mutation,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { Buckets } from 'src/lib/files/s3'
import S3Path from 'src/lib/files/S3Path'
import { parallel } from 'src/lib/async'
import { logger } from 'src/lib/logger'

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

interface ImagesOpts {
  select?: Prisma.ImageSelect
}

export const images = (
  { filter, take, skip, sorting, cursor }: QueryimagesArgs,
  opts: ImagesOpts = {}
): Promise<PImage[]> => {
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
  if (opts.select) {
    query.select = opts.select
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
  input: { imageIds, filter },
}: MutationdeleteManyImagesArgs): Promise<Mutation['deleteManyImages']> => {
  if (!filter && !imageIds) throw new Error('need either imagesIds or filter')
  if (filter && imageIds)
    throw new Error('need only one of imagesIds or filter')

  if (filter) {
    const imagesToApply = await images({
      filter: filter,
      take: 0,
    })
    imageIds = imagesToApply.map((i) => i.id)
  }

  const parallelActions = await parallel<string, boolean>(
    imageIds,
    5,
    async (imageId) => {
      const image = await db.image.findUnique({
        where: {
          id: imageId,
        },
      })
      if (!image) return false
      await Buckets.photos.delete(image.path)
      await Buckets.miniatures.delete(image.path)
      await db.image.delete({
        where: {
          id: imageId,
        },
      })
      return true
    }
  )
  const result = await parallelActions.finished()

  const count = result.successes.filter((s) => s.result).length

  if (result.errors.length > 0) {
    logger.error({ errors: result.errors }, 'Errors while deleting images')
  }

  return {
    count,
  }
}

export const editImagesBasePath = async ({
  input: { imageIds, basePath, filter },
}: MutationeditImagesBasePathArgs): Promise<Mutation['editImagesBasePath']> => {
  if (!filter && !imageIds) throw new Error('need either imagesIds or filter')
  if (filter && imageIds)
    throw new Error('need only one of imagesIds or filter')

  if (filter) {
    const imagesToApply = await images({
      filter: filter,
      take: 0,
    })
    imageIds = imagesToApply.map((i) => i.id)
  }

  const parallelActions = await parallel<string, boolean>(
    imageIds,
    5,
    async (imageId) => {
      const imageToEdit = await image({ id: imageId })
      if (!imageToEdit) {
        return false
      }
      const fileName = S3Path.getFileName(imageToEdit.path)
      const path = S3Path.getPath(basePath, fileName)
      if (path === imageToEdit.path) return false

      await db.image.update({
        where: { id: imageId },
        data: {
          path,
        },
      })
      await Buckets.photos.editKey(imageToEdit.path, path)
      await Buckets.miniatures.editKey(imageToEdit.path, path)
      return true
    }
  )

  const result = await parallelActions.finished()

  const count = result.successes.filter((s) => s.result).length

  if (result.errors.length > 0) {
    logger.error({ errors: result.errors }, 'Errors while deleting images')
  }

  return {
    count,
  }
}
