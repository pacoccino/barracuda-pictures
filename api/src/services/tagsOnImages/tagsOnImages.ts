import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const tagsOnImages = () => {
  return db.tagsOnImage.findMany()
}

export const tagsOnImage = ({ id }: Prisma.TagsOnImageWhereUniqueInput) => {
  return db.tagsOnImage.findUnique({
    where: { id },
  })
}

export const TagsOnImage = {
  tag: (_obj, { root }: ResolverArgs<ReturnType<typeof tagsOnImage>>) =>
    db.tagsOnImage.findUnique({ where: { id: root.id } }).tag(),
  image: (_obj, { root }: ResolverArgs<ReturnType<typeof tagsOnImage>>) =>
    db.tagsOnImage.findUnique({ where: { id: root.id } }).image(),
}

export const createTagsOnImage = async ({ input: { imageId, tagId } }) => {
  return db.tagsOnImage.upsert({
    where: { tagId_imageId: { imageId, tagId } },
    create: { imageId, tagId },
    update: { imageId, tagId },
  })
}

export const deleteTagsOnImage = async ({ input: { imageId, tagId } }) => {
  try {
    await db.tagsOnImage.deleteMany({
      where: { imageId, tagId },
    })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
