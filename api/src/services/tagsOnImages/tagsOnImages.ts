import type { Prisma, TagsOnImage as TagsOnImageType } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import type {
  MutationcreateManyTagsOnImageArgs,
  MutationcreateTagsOnImageArgs,
  MutationdeleteTagsOnImageArgs,
  MutationdeleteManyTagsOnImageArgs,
  UpdateManyResult,
  MutationapplyTagOnFilterArgs,
  MutationapplyManyTagsOnImage,
} from 'types/graphql'
import { db } from 'src/lib/db'
import { images } from 'src/services/images/images'

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

export const applyManyTagsOnImage = async ({
  input,
}: MutationapplyManyTagsOnImage): Promise<UpdateManyResult> => {
  if (input.applyMode === 'ADD') {
    return db.tagsOnImage.createMany({
      data: input.tagsOnImage,
      skipDuplicates: true,
    })
  } else if (input.applyMode === 'REMOVE') {
    return db.tagsOnImage.deleteMany({
      where: {
        OR: input.tagsOnImage,
      },
    })
  }
}

export const applyTagOnFilter = async ({
  input,
}: MutationapplyTagOnFilterArgs): Promise<UpdateManyResult> => {
  const imagesToApply = await images({
    filter: input.filter,
    take: 0,
  })

  const manyInput = imagesToApply.map((i) => ({
    imageId: i.id,
    tagId: input.tagId,
  }))

  if (input.applyMode === 'ADD') {
    return db.tagsOnImage.createMany({
      data: manyInput,
      skipDuplicates: true,
    })
  } else if (input.applyMode === 'REMOVE') {
    return db.tagsOnImage.deleteMany({
      where: {
        OR: manyInput,
      },
    })
  }
}
