import { tagCategory, tagCategorys, createTagCategory } from './tagCategorys'
import type { StandardScenario } from './tagCategorys.scenarios'

describe('tagCategorys', () => {
  scenario('returns all tagCategorys', async (scenario: StandardScenario) => {
    const result = await tagCategorys()

    expect(result.length).toEqual(Object.keys(scenario.tagCategory).length)
  })

  scenario('create tagCategory', async () => {
    const input = { name: 'bob' }

    const tg = await createTagCategory({ input })

    const result = await tagCategory({ id: tg.id })

    expect(result).toEqual(tg)
  })
})
