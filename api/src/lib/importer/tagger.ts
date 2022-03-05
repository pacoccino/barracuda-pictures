import { Image } from '@prisma/client'
import { ImageMetadata, joinString } from 'src/lib/images/metadata'
import { db } from 'src/lib/db'

export async function createImageTags(
  image: Image,
  imageMetadata: ImageMetadata
) {
  // Camera

  const tagCategory_cameraInput = {
    name: 'Camera',
  }
  const tagCategory_camera = await db.tagCategory.upsert({
    where: tagCategory_cameraInput,
    update: tagCategory_cameraInput,
    create: tagCategory_cameraInput,
  })
  const tagInput = {
    name: imageMetadata.parsed.camera
      ? joinString([
          imageMetadata.parsed.camera.make,
          imageMetadata.parsed.camera.model,
        ])
      : 'Unknown',
    tagCategoryId: tagCategory_camera.id,
  }
  await db.tagsOnImage.create({
    data: {
      tag: {
        connectOrCreate: {
          create: tagInput,
          where: {
            name_tagCategoryId: tagInput,
          },
        },
      },
      image: {
        connect: {
          id: image.id,
        },
      },
    },
  })

  // keywords

  if (imageMetadata.parsed.keywords) {
    const tagCategory_keywordsInput = {
      name: 'Keywords',
    }
    const tagCategory_keywords = await db.tagCategory.upsert({
      where: tagCategory_keywordsInput,
      update: tagCategory_keywordsInput,
      create: tagCategory_keywordsInput,
    })

    for (const i in imageMetadata.parsed.keywords) {
      const keyword = imageMetadata.parsed.keywords[i]
      const tag_keywordInput = {
        name: keyword,
        tagCategoryId: tagCategory_keywords.id,
      }
      const tag_keyword = await db.tag.upsert({
        where: {
          name_tagCategoryId: tag_keywordInput,
        },
        update: tag_keywordInput,
        create: tag_keywordInput,
      })
      await db.tagsOnImage.create({
        data: {
          tagId: tag_keyword.id,
          imageId: image.id,
        },
      })
    }
  }
}
