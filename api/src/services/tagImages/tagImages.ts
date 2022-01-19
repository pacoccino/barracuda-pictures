import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const tagImages = () => {
  return db.tagImage.findMany()
}

export const tagImage = ({ id }: Prisma.TagImageWhereUniqueInput) => {
  return db.tagImage.findUnique({
    where: { id },
  })
}

export const TagImage = {
  tag: (_obj, { root }: ResolverArgs<ReturnType<typeof tagImage>>) =>
    db.tagImage.findUnique({ where: { id: root.id } }).tag(),
  image: (_obj, { root }: ResolverArgs<ReturnType<typeof tagImage>>) =>
    db.tagImage.findUnique({ where: { id: root.id } }).image(),
}
