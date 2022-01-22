import { tagGroup, tagGroups, createTagGroup } from './tagGroups'
import type { StandardScenario } from './tagGroups.scenarios'

describe('tagGroups', () => {
  scenario('returns all tagGroups', async (scenario: StandardScenario) => {
    const result = await tagGroups()

    expect(result.length).toEqual(Object.keys(scenario.tagGroup).length)
  })

  scenario('create tagGroup', async () => {
    const input = { name: 'bob' }

    const tg = await createTagGroup(input)

    const result = await tagGroup({ id: tg.id })

    expect(result).toEqual(tg)
  })
})
