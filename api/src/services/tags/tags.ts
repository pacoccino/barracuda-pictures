import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const tags = () => {
  return db.tag.findMany()
}

export const tag = ({ id }: Prisma.TagWhereUniqueInput) => {
  return db.tag.findUnique({
    where: { id },
  })
}

export const Tag = {
  tagCategory: (_obj, { root }: ResolverArgs<ReturnType<typeof tag>>) =>
    db.tag.findUnique({ where: { id: root.id } }).tagCategory(),
  tagsOnImages: (_obj, { root }: ResolverArgs<ReturnType<typeof tag>>) =>
    db.tag.findUnique({ where: { id: root.id } }).tagsOnImages(),
}

export const createTag = async ({ input: { name, tagCategoryId } }) => {
  return db.tag.create({
    data: { name, tagCategoryId },
  })
}

export const updateTag = async ({ id, input }) => {
  return db.tag.update({
    where: { id },
    data: { name: input.name, tagCategoryId: input.tagCategoryId },
  })
}

export const deleteTag = async ({ id }) => {
  try {
    await db.tag.deleteMany({
      where: { id },
    })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
