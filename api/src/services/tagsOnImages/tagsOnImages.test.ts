import {
  tagsOnImages,
  createTagsOnImage,
  createManyTagsOnImage,
  deleteTagsOnImage,
  deleteManyTagsOnImage,
  applyTagOnFilter,
  applyManyTagsOnImage,
} from './tagsOnImages'
import type { StandardScenario } from './tagsOnImages.scenarios'
import { ApplyTagOnFilter, ImageFilters } from 'types/graphql'

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

  scenario(
    'apply many tagsOnImages ADD',
    async (scenario: StandardScenario) => {
      const image = scenario.image.p1
      const tag = scenario.tag.g1t2
      const tag2 = scenario.tag.g2t2

      const input = {
        applyMode: 'ADD',
        tagsOnImage: [
          { imageId: image.id, tagId: tag.id },
          { imageId: image.id, tagId: tag2.id },
        ],
      }
      const result = await applyManyTagsOnImage({
        input,
      })

      expect(result.count).toEqual(2)
    }
  )

  scenario(
    'apply many tagsOnImages REMOVE',
    async (scenario: StandardScenario) => {
      const image = scenario.image.p1
      const tag = scenario.tag.g1t1
      const tag2 = scenario.tag.g2t1

      const input = {
        applyMode: 'REMOVE',
        tagsOnImage: [
          { imageId: image.id, tagId: tag.id },
          { imageId: image.id, tagId: tag2.id },
        ],
      }
      const result = await applyManyTagsOnImage({
        input,
      })

      expect(result.count).toEqual(2)
    }
  )

  scenario('apply tag on filter ADD', async (scenario: StandardScenario) => {
    const filter: ImageFilters = {
      tagLists: [
        {
          tagGroupId: scenario.tagGroup.one.id,
          tagIds: [scenario.tag.g1t1.id],
          condition: 'OR',
        },
      ],
    }

    const input: ApplyTagOnFilter = {
      filter,
      tagId: scenario.tag.g1t2.id,
      applyMode: 'ADD',
    }
    const result = await applyTagOnFilter({
      input,
    })

    expect(result.count).toEqual(1)
  })
  scenario('apply tag on filter REMOVE', async (scenario: StandardScenario) => {
    const filter: ImageFilters = {
      tagLists: [
        {
          tagGroupId: scenario.tagGroup.one.id,
          tagIds: [scenario.tag.g1t1.id],
          condition: 'OR',
        },
      ],
    }

    const input: ApplyTagOnFilter = {
      filter,
      tagId: scenario.tag.g1t1.id,
      applyMode: 'REMOVE',
    }
    const result = await applyTagOnFilter({
      input,
    })

    expect(result.count).toEqual(1)
  })
})
