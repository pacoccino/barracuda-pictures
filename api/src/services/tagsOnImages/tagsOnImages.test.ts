import { tagsOnImages } from './tagsOnImages'
import type { StandardScenario } from './tagsOnImages.scenarios'

describe('tagsOnImages', () => {
  scenario('returns all tagsOnImages', async (scenario: StandardScenario) => {
    const result = await tagsOnImages()

    expect(result.length).toEqual(4)
  })
})
