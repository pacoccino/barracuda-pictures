import { tagImages } from './tagImages'
import type { StandardScenario } from './tagImages.scenarios'

describe('tagImages', () => {
  scenario('returns all tagImages', async (scenario: StandardScenario) => {
    const result = await tagImages()

    expect(result.length).toEqual(Object.keys(scenario.tagImage).length)
  })
})
