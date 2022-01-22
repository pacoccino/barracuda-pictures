import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const tagGroups = () => {
  return db.tagGroup.findMany()
}

export const tagGroup = ({ id }: Prisma.TagGroupWhereUniqueInput) => {
  return db.tagGroup.findUnique({
    where: { id },
  })
}

export const TagGroup = {
  tags: (_obj, { root }: ResolverArgs<ReturnType<typeof tagGroup>>) =>
    db.tagGroup.findUnique({ where: { id: root.id } }).tags(),
}

export const createTagGroup = async ({ name }) => {
  return db.tagGroup.create({
    data: { name },
  })
}

export const updateTagGroup = async ({ id, input }) => {
  return db.tagGroup.update({
    where: { id },
    data: { name: input.name },
  })
}

export const deleteTagGroup = async ({ id }) => {
  try {
    await db.tagGroup.deleteMany({
      where: { id },
    })
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}
