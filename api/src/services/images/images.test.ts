import {
  deleteManyImages,
  deleteManyImagesWithFilter,
  image,
  images,
  moreImages,
} from './images'
import type { StandardScenario } from './images.scenarios'
import { ImageFilters } from 'types/graphql'
import { Buckets } from 'src/lib/files/s3'

describe('images', () => {
  scenario('returns one image', async (scenario: StandardScenario) => {
    const result = await image({
      id: scenario.image.p1.id,
    })

    expect(result).toEqual(scenario.image.p1)
  })

  describe('images', () => {
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

    scenario('takes 2', async (scenario: StandardScenario) => {
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

    scenario('take+cursor 1', async (scenario: StandardScenario) => {
      const result = await images({
        take: 1,
        cursor: scenario.image.p2.id,
        sorting: {
          dateTaken: 'asc',
        },
      })

      expect(result.length).toEqual(1)
      expect(result[0]).toEqual(scenario.image.p2)
    })
    scenario('take+cursor -1 skip 1', async (scenario: StandardScenario) => {
      const result = await images({
        take: -1,
        skip: 1,
        cursor: scenario.image.p2.id,
        sorting: {
          dateTaken: 'asc',
        },
      })

      expect(result.length).toEqual(1)
      expect(result[0]).toEqual(scenario.image.p1)
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
      scenario('path', async (scenario: StandardScenario) => {
        const result = await images({
          filter: {
            path: 'ath1',
          },
        })

        expect(result.length).toEqual(2)
        expect(result).toContainEqual(scenario.image.p2)
        expect(result).toContainEqual(scenario.image.p3)
      })
    })
  })

  scenario('images = moreImages', async () => {
    expect(images).toBe(moreImages)
  })

  describe('delete', () => {
    scenario('delete many images', async (scenario: StandardScenario) => {
      const si = Object.values(scenario.image)
      for (const i in Object.keys(scenario.image)) {
        const image = si[i]
        await Buckets.photos.put(image.path, image.path)
        await Buckets.miniatures.put(image.path, image.path)
      }
      const imagesToDelete = [scenario.image.p1, scenario.image.p3]

      const result = await deleteManyImages({
        imageIds: imagesToDelete.map((i) => i.id),
      })

      expect(result.count).toEqual(imagesToDelete.length)
      await Promise.all(
        imagesToDelete.map(async (im) => {
          const resImage = await image({ id: im.id })
          expect(resImage).toBeNull()
          const sd = await Buckets.photos.get(im.path)
          expect(sd).toBeNull()
          const sm = await Buckets.miniatures.get(im.path)
          expect(sm).toBeNull()
        })
      )

      const resImages = await images({
        take: 0,
      })
      expect(resImages.length).toEqual(
        Object.keys(scenario.image).length - imagesToDelete.length
      )
    })

    scenario(
      'delete many images with filters',
      async (scenario: StandardScenario) => {
        const expectedRemovedIds = [
          scenario.image.p1.id,
          scenario.image.p3.id,
          scenario.image.p5.id,
        ]
        const filter: ImageFilters = {
          tagLists: [
            {
              tagGroupId: scenario.tagGroup.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
          ],
        }

        const result = await deleteManyImagesWithFilter({
          filter,
        })

        expect(result.count).toEqual(expectedRemovedIds.length)

        await Promise.all(
          expectedRemovedIds.map(async (id) => {
            const resImage = await image({ id })
            expect(resImage).toBeNull()
          })
        )

        const resImages = await images({
          take: 0,
        })
        expect(resImages.length).toEqual(
          Object.keys(scenario.image).length - expectedRemovedIds.length
        )
      }
    )
  })
})
