import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const tagCategorys = () => {
  return db.tagCategory.findMany()
}

export const tagCategory = ({ id }: Prisma.TagCategoryWhereUniqueInput) => {
  return db.tagCategory.findUnique({
    where: { id },
  })
}

export const TagCategory = {
  tags: (_obj, { root }: ResolverArgs<ReturnType<typeof tagCategory>>) =>
    db.tagCategory.findUnique({ where: { id: root.id } }).tags(),
}

export const createTagCategory = async ({ input: { name } }) => {
  return db.tagCategory.create({
    data: { name },
  })
}

export const updateTagCategory = async ({ id, input }) => {
  return db.tagCategory.update({
    where: { id },
    data: { name: input.name },
  })
}

export const deleteTagCategory = async ({ id }) => {
  try {
    await db.tagCategory.deleteMany({
      where: { id },
    })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
