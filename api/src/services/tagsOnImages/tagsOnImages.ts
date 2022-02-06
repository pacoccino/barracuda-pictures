import type { Prisma, TagsOnImage as TagsOnImageType } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import type {
  MutationcreateManyTagsOnImageArgs,
  MutationcreateTagsOnImageArgs,
  MutationdeleteTagsOnImageArgs,
  UpdateManyResult,
} from 'types/graphql'
import { db } from 'src/lib/db'
import { MutationdeleteManyTagsOnImageArgs } from 'types/graphql'

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

export const createTagsOnImage = async ({
  input,
}: MutationcreateTagsOnImageArgs): Promise<TagsOnImageType> => {
  return db.tagsOnImage.upsert({
    where: { tagId_imageId: input },
    create: input,
    update: input,
  })
}
export const createManyTagsOnImage = async ({
  input,
}: MutationcreateManyTagsOnImageArgs): Promise<UpdateManyResult> => {
  return db.tagsOnImage.createMany({
    data: input,
    skipDuplicates: true,
  })
}

export const deleteTagsOnImage = async ({
  input,
}: MutationdeleteTagsOnImageArgs): Promise<TagsOnImageType> => {
  return db.tagsOnImage.delete({
    where: {
      tagId_imageId: input,
    },
  })
}

export const deleteManyTagsOnImage = async ({
  input,
}: MutationdeleteManyTagsOnImageArgs): Promise<UpdateManyResult> => {
  return db.tagsOnImage.deleteMany({
    where: {
      OR: input,
    },
  })
}
