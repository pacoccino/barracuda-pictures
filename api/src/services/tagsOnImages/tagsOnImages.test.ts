import {
  tagsOnImages,
  createTagsOnImage,
  createManyTagsOnImage,
  deleteTagsOnImage,
  deleteManyTagsOnImage,
} from './tagsOnImages'
import type { StandardScenario } from './tagsOnImages.scenarios'

describe('tagsOnImages', () => {
  scenario('returns all tagsOnImages', async (scenario: StandardScenario) => {
    const result = await tagsOnImages()

    expect(result.length).toEqual(4)
  })
  scenario('create one tagsOnImages', async (scenario: StandardScenario) => {
    const image = scenario.image.p1
    const tag = scenario.tag.g1t2

    const input = { imageId: image.id, tagId: tag.id }
    const result = await createTagsOnImage({
      input,
    })

    expect(result).toEqual(expect.objectContaining(input))
  })
  scenario('create many tagsOnImages', async (scenario: StandardScenario) => {
    const image = scenario.image.p1
    const tag = scenario.tag.g1t2
    const tag2 = scenario.tag.g2t2

    const input = [
      { imageId: image.id, tagId: tag.id },
      { imageId: image.id, tagId: tag2.id },
    ]
    const result = await createManyTagsOnImage({
      input,
    })

    expect(result.count).toEqual(2)
  })

  scenario('delete one tagsOnImages', async (scenario: StandardScenario) => {
    const image = scenario.image.p1
    const tag = scenario.tag.g1t1

    const input = { imageId: image.id, tagId: tag.id }
    const result = await deleteTagsOnImage({
      input,
    })

    expect(result).toEqual(expect.objectContaining(input))
  })

  scenario('delete many tagsOnImages', async (scenario: StandardScenario) => {
    const image = scenario.image.p1
    const tag = scenario.tag.g1t1
    const tag2 = scenario.tag.g2t1

    const input = [
      { imageId: image.id, tagId: tag.id },
      { imageId: image.id, tagId: tag2.id },
    ]
    const result = await deleteManyTagsOnImage({
      input,
    })

    expect(result.count).toEqual(2)
  })
})
