import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import { db } from 'src/lib/db'

export const images = () => {
  return db.image.findMany()
}

export const image = ({ id }: Prisma.ImageWhereUniqueInput) => {
  return db.image.findUnique({
    where: { id },
  })
}

export const Image = {
  tagsOnImages: (_obj, { root }: ResolverArgs<ReturnType<typeof image>>) =>
    db.image.findUnique({ where: { id: root.id } }).tagsOnImages(),
}

type AddTagInput = {
  id: number
  tagId: number
}
/*
export const addTag = ({ id, tagId }: AddTagInput) => {
  return db.image.update({
    where: { id },
    data: {
      tags: {
        connectOrCreate: {
          where: { id: tagId },
          create: {
            id: tagId,
            name: 'fdz',
          },
        },
      },
    },
  })
}
*/
