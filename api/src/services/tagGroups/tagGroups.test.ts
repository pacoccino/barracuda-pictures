import { tagGroups } from './tagGroups'
import type { StandardScenario } from './tagGroups.scenarios'

describe('tagGroups', () => {
  scenario('returns all tagGroups', async (scenario: StandardScenario) => {
    const result = await tagGroups()

    expect(result.length).toEqual(Object.keys(scenario.tagGroup).length)
  })
})
