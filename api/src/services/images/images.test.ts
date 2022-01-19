import { images } from './images'
import type { StandardScenario } from './images.scenarios'

describe('images', () => {
  scenario('returns all images', async (scenario: StandardScenario) => {
    const result = await images()

    expect(result.length).toEqual(Object.keys(scenario.image).length)
  })
})
