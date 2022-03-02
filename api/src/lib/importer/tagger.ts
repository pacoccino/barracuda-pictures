import { Image } from '@prisma/client'
import { ImageMetadata, joinString } from 'src/lib/images/metadata'
import { db } from 'src/lib/db'

export async function createImageTags(
  image: Image,
  imageMetadata: ImageMetadata
) {
  // Camera

  const tagGroup_cameraInput = {
    name: 'Camera',
  }
  const tagGroup_camera = await db.tagGroup.upsert({
    where: tagGroup_cameraInput,
    update: tagGroup_cameraInput,
    create: tagGroup_cameraInput,
  })
  const tagInput = {
    name: imageMetadata.parsed.camera
      ? joinString([
          imageMetadata.parsed.camera.make,
          imageMetadata.parsed.camera.model,
        ])
      : 'Unknown',
    tagGroupId: tagGroup_camera.id,
  }
  await db.tagsOnImage.create({
    data: {
      tag: {
        connectOrCreate: {
          create: tagInput,
          where: {
            name_tagGroupId: tagInput,
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
    const tagGroup_keywordsInput = {
      name: 'Keywords',
    }
    const tagGroup_keywords = await db.tagGroup.upsert({
      where: tagGroup_keywordsInput,
      update: tagGroup_keywordsInput,
      create: tagGroup_keywordsInput,
    })

    for (const i in imageMetadata.parsed.keywords) {
      const keyword = imageMetadata.parsed.keywords[i]
      const tag_keywordInput = {
        name: keyword,
        tagGroupId: tagGroup_keywords.id,
      }
      const tag_keyword = await db.tag.upsert({
        where: {
          name_tagGroupId: tag_keywordInput,
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
