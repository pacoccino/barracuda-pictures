import { image, images } from './images'
import type { StandardScenario } from './images.scenarios'

describe('images', () => {
  scenario('returns one image', async (scenario: StandardScenario) => {
    const result = await image({
      id: scenario.image.p1.id,
    })

    expect(result).toEqual(scenario.image.p1)
  })
  scenario('returns all images', async (scenario: StandardScenario) => {
    const result = await images({})

    expect(result.length).toEqual(Object.keys(scenario.image).length)
  })

  scenario(
    'returns images with one tag',
    async (scenario: StandardScenario) => {
      const result = await images({
        filter: {
          tagLists: [
            {
              tagGroupId: scenario.tagGroup.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
          ],
        },
      })

      expect(result.length).toEqual(3)
      expect(result).toContainEqual(scenario.image.p1)
      expect(result).toContainEqual(scenario.image.p3)
      expect(result).toContainEqual(scenario.image.p5)
    }
  )

  scenario(
    'returns images with one tag in different categories',
    async (scenario: StandardScenario) => {
      const result = await images({
        filter: {
          tagLists: [
            {
              tagGroupId: scenario.tagGroup.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
            {
              tagGroupId: scenario.tagGroup.two.id,
              tagIds: [scenario.tag.g2t1.id],
              condition: 'OR',
            },
          ],
        },
      })

      expect(result.length).toEqual(1)
      expect(result).toContainEqual(scenario.image.p1)
    }
  )
  scenario(
    'returns images with two tags in different categories',
    async (scenario: StandardScenario) => {
      const result = await images({
        filter: {
          tagLists: [
            {
              tagGroupId: scenario.tagGroup.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
            {
              tagGroupId: scenario.tagGroup.two.id,
              tagIds: [scenario.tag.g2t1.id, scenario.tag.g2t2.id],
              condition: 'OR',
            },
          ],
        },
      })

      expect(result.length).toEqual(3)
      expect(result).toContainEqual(scenario.image.p1)
      expect(result).toContainEqual(scenario.image.p3)
      expect(result).toContainEqual(scenario.image.p5)
    }
  )

  scenario(
    'returns images with two tags in different categories with AND',
    async (scenario: StandardScenario) => {
      const result = await images({
        filter: {
          tagLists: [
            {
              tagGroupId: scenario.tagGroup.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
            {
              tagGroupId: scenario.tagGroup.two.id,
              tagIds: [scenario.tag.g2t2.id, scenario.tag.g2t3.id],
              condition: 'AND',
            },
          ],
        },
      })

      expect(result.length).toEqual(1)
      expect(result).toContainEqual(scenario.image.p5)
    }
  )

  scenario('sorts by date taken asc', async (scenario: StandardScenario) => {
    const result = await images({
      sorting: {
        dateTaken: 'asc',
      },
    })

    expect(result.length).toEqual(Object.keys(scenario.image).length)
    expect(result[0]).toEqual(scenario.image.p1)
    expect(result[result.length - 1]).toEqual(scenario.image.notag)
  })
  scenario('sorts by date taken desc', async (scenario: StandardScenario) => {
    const result = await images({
      sorting: {
        dateTaken: 'desc',
      },
    })

    expect(result.length).toEqual(Object.keys(scenario.image).length)
    expect(result[0]).toEqual(scenario.image.notag)
    expect(result[result.length - 1]).toEqual(scenario.image.p1)
  })

  scenario('takes', async (scenario: StandardScenario) => {
    const result = await images({
      take: 2,
      sorting: {
        dateTaken: 'asc',
      },
    })

    expect(result.length).toEqual(2)
    expect(result[0]).toEqual(scenario.image.p1)
    expect(result[1]).toEqual(scenario.image.p2)
  })
  scenario('skips', async (scenario: StandardScenario) => {
    const result = await images({
      take: 2,
      skip: 2,
      sorting: {
        dateTaken: 'asc',
      },
    })

    expect(result.length).toEqual(2)
    expect(result[0]).toEqual(scenario.image.p3)
    expect(result[1]).toEqual(scenario.image.p4)
  })

  describe(' filter date range', () => {
    scenario('date range from to', async (scenario: StandardScenario) => {
      const result = await images({
        sorting: {
          dateTaken: 'asc',
        },
        filter: {
          dateRange: {
            from: '2022-01-01T00:03:00Z',
            to: '2022-01-01T00:04:00Z',
          },
        },
      })

      expect(result.length).toEqual(2)
      expect(result[0]).toEqual(scenario.image.p3)
      expect(result[1]).toEqual(scenario.image.p4)
    })
    scenario('date range from', async (scenario: StandardScenario) => {
      const result = await images({
        sorting: {
          dateTaken: 'asc',
        },
        filter: {
          dateRange: {
            from: '2022-01-01T00:05:00Z',
          },
        },
      })

      expect(result.length).toEqual(2)
      expect(result[0]).toEqual(scenario.image.p5)
      expect(result[1]).toEqual(scenario.image.notag)
    })
    scenario('date range to', async (scenario: StandardScenario) => {
      const result = await images({
        sorting: {
          dateTaken: 'asc',
        },
        filter: {
          dateRange: {
            to: '2022-01-01T00:02:00Z',
          },
        },
      })

      expect(result.length).toEqual(2)
      expect(result[0]).toEqual(scenario.image.p1)
      expect(result[1]).toEqual(scenario.image.p2)
    })
  })
})
