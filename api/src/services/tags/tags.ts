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
  tagGroup: (_obj, { root }: ResolverArgs<ReturnType<typeof tag>>) =>
    db.tag.findUnique({ where: { id: root.id } }).tagGroup(),
  images: (_obj, { root }: ResolverArgs<ReturnType<typeof tag>>) =>
    db.tag.findUnique({ where: { id: root.id } }).images(),
}
