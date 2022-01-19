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
