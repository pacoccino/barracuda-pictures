import { tags } from './tags'
import type { StandardScenario } from './tags.scenarios'

describe('tags', () => {
  scenario('returns all tags', async (scenario: StandardScenario) => {
    const result = await tags()

    expect(result.length).toEqual(Object.keys(scenario.tag).length)
  })
})
