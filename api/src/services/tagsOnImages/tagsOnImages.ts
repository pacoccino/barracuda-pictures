import type { Prisma, TagsOnImage as TagsOnImageType } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

import type {
  MutationcreateTagsOnImageArgs,
  MutationdeleteTagsOnImageArgs,
  UpdateManyResult,
  MutationapplyTagOnFilterArgs,
  MutationapplyManyTagsOnImageArgs,
} from 'types/graphql'
import { db } from 'src/lib/db'
import { selectAllImages } from 'src/services/images/images'

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

export const deleteTagsOnImage = async ({
  input,
}: MutationdeleteTagsOnImageArgs): Promise<TagsOnImageType> => {
  return db.tagsOnImage.delete({
    where: {
      tagId_imageId: input,
    },
  })
}

export const applyManyTagsOnImage = async ({
  input,
}: MutationapplyManyTagsOnImageArgs): Promise<UpdateManyResult> => {
  if (input.applyMode === 'ADD') {
    return db.tagsOnImage.createMany({
      data: input.tagsOnImages,
      skipDuplicates: true,
    })
  } else if (input.applyMode === 'REMOVE') {
    return db.tagsOnImage.deleteMany({
      where: {
        OR: input.tagsOnImages,
      },
    })
  }
}

export const applyTagOnFilter = async ({
  input: { filter, applyMode, tagId },
}: MutationapplyTagOnFilterArgs): Promise<UpdateManyResult> => {
  const imagesToApply = await selectAllImages({ filter })

  const tagsOnImages = imagesToApply.map((i) => ({
    imageId: i.id,
    tagId: tagId,
  }))

  return applyManyTagsOnImage({ input: { tagsOnImages, applyMode } })
}
