import { createTag, tag, tags, updateTag, deleteTag } from './tags'
import type { StandardScenario } from './tags.scenarios'

describe('tags', () => {
  scenario('returns all tags', async (scenario: StandardScenario) => {
    const result = await tags()

    expect(result.length).toEqual(Object.keys(scenario.tag).length)
  })
  scenario('returns one tags', async (scenario: StandardScenario) => {
    const result = await tag({ id: scenario.tag.g1t1.id })

    expect(result).toEqual(scenario.tag.g1t1)
  })
  scenario('create tag', async (scenario: StandardScenario) => {
    const input = { name: 'a', tagGroupId: scenario.tagGroup.one.id }
    const result = await createTag({ input })

    expect(result).toMatchObject(input)
  })
  scenario('update tag name', async (scenario: StandardScenario) => {
    const input = { name: 'bbbb' }
    const result = await updateTag({ id: scenario.tag.g1t1.id, input })

    expect(result).toMatchObject({ ...scenario.tag.g1t1, ...input })
  })
  scenario('update tag category', async (scenario: StandardScenario) => {
    const input = { tagGroupId: scenario.tagGroup.two.id }
    const result = await updateTag({ id: scenario.tag.g1t1.id, input })

    expect(result).toMatchObject({ ...scenario.tag.g1t1, ...input })
  })
  scenario('deleteTag', async (scenario: StandardScenario) => {
    await deleteTag({ id: scenario.tag.g1t1.id })
    const result = await tag({ id: scenario.tag.g1t1.id })

    expect(result).toBeNull()
  })
})
