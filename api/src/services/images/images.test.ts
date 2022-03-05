import {
  deleteManyImages,
  editImages,
  editImagesBasePath,
  image,
  images,
  moreImages,
} from './images'
import type { StandardScenario } from './images.scenarios'
import { ImageFilters } from 'types/graphql'
import { Buckets } from 'src/lib/files/s3'
import S3Path from 'src/lib/files/S3Path'

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
                tagCategoryId: scenario.tagCategory.one.id,
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
                tagCategoryId: scenario.tagCategory.one.id,
                tagIds: [scenario.tag.g1t1.id],
                condition: 'OR',
              },
              {
                tagCategoryId: scenario.tagCategory.two.id,
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
                tagCategoryId: scenario.tagCategory.one.id,
                tagIds: [scenario.tag.g1t1.id],
                condition: 'OR',
              },
              {
                tagCategoryId: scenario.tagCategory.two.id,
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
                tagCategoryId: scenario.tagCategory.one.id,
                tagIds: [scenario.tag.g1t1.id],
                condition: 'OR',
              },
              {
                tagCategoryId: scenario.tagCategory.two.id,
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

    describe('filter date range', () => {
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

    describe('filter rating', () => {
      scenario('less than', async (scenario: StandardScenario) => {
        const result = await images({
          filter: {
            rating: {
              value: 2,
              condition: 'lte',
            },
          },
        })

        expect(result.length).toEqual(3)
        expect(result).toContainEqual(scenario.image.p1)
        expect(result).toContainEqual(scenario.image.p2)
        expect(result).toContainEqual(scenario.image.notag)
      })
      scenario('greater than', async (scenario: StandardScenario) => {
        const result = await images({
          filter: {
            rating: {
              value: 2,
              condition: 'gte',
            },
          },
        })

        expect(result.length).toEqual(4)
        expect(result).toContainEqual(scenario.image.p2)
        expect(result).toContainEqual(scenario.image.p3)
        expect(result).toContainEqual(scenario.image.p4)
        expect(result).toContainEqual(scenario.image.p5)
      })
      scenario('equals', async (scenario: StandardScenario) => {
        const result = await images({
          filter: {
            rating: {
              value: 2,
              condition: 'equals',
            },
          },
        })

        expect(result.length).toEqual(1)
        expect(result).toContainEqual(scenario.image.p2)
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
        select: {
          imageIds: ['not-existing']
            .concat(imagesToDelete.map((i) => i.id))
            .concat('neither'),
        },
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
              tagCategoryId: scenario.tagCategory.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
          ],
        }

        const result = await deleteManyImages({
          select: {
            filter,
          },
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

    scenario(
      'delete many XOR arguments',
      async (scenario: StandardScenario) => {
        const imageIds = ['a', 'b']
        const filter: ImageFilters = {
          tagLists: [
            {
              tagCategoryId: scenario.tagCategory.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
          ],
        }
        await expect(
          deleteManyImages({
            select: {
              filter,
              imageIds,
            },
          })
        ).rejects.toThrowError('need only one of imagesIds or filter')
        await expect(
          deleteManyImages({
            select: {},
          })
        ).rejects.toThrowError('need either imagesIds or filter')
      }
    )
  })

  describe('edit base path', () => {
    async function testEditImagesBasePath(
      imagesToEdit,
      basePath,
      newPaths,
      count
    ) {
      for (const i in imagesToEdit) {
        const imageToEdit = imagesToEdit[i]
        if (!imageToEdit) continue
        await Buckets.photos.put(imageToEdit.path, imageToEdit.path)
        await Buckets.miniatures.put(imageToEdit.path, imageToEdit.path)
      }

      const result = await editImagesBasePath({
        select: {
          imageIds: imagesToEdit.map((i) => (i ? i.id : 'numbid')),
        },
        input: {
          basePath,
        },
      })

      expect(result.count).toBe(count)

      for (const i in imagesToEdit) {
        const imageToEdit = imagesToEdit[i]
        if (!imageToEdit) continue
        const newPath = newPaths[i]
        const resImage = await image({ id: imageToEdit.id })
        expect(resImage.path).toEqual(newPath)

        expect((await Buckets.photos.get(newPath)).toString()).toEqual(
          imageToEdit.path
        )
        expect((await Buckets.miniatures.get(newPath)).toString()).toEqual(
          imageToEdit.path
        )
        if (imageToEdit.path !== newPath) {
          expect(await Buckets.photos.get(imageToEdit.path)).toBeNull()
          expect(await Buckets.miniatures.get(imageToEdit.path)).toBeNull()
        }
      }
    }
    scenario(
      'editImagesBasePath image with path',
      async (scenario: StandardScenario) => {
        await testEditImagesBasePath(
          [scenario.image.p3],
          'patate/labas',
          ['patate/labas/p3.jpg'],
          1
        )
      }
    )
    scenario(
      'editImagesBasePath image without path',
      async (scenario: StandardScenario) => {
        await testEditImagesBasePath(
          [scenario.image.p5],
          'caca/caca',
          ['caca/caca/p5.jpg'],
          1
        )
      }
    )

    scenario(
      'editImagesBasePath image mixed path',
      async (scenario: StandardScenario) => {
        await testEditImagesBasePath(
          [scenario.image.p3, scenario.image.p5],
          'ici/labas',
          ['ici/labas/p3.jpg', 'ici/labas/p5.jpg'],
          2
        )
      }
    )
    scenario(
      'editImagesBasePath image one same path',
      async (scenario: StandardScenario) => {
        await testEditImagesBasePath(
          [scenario.image.p4, scenario.image.p5],
          'ath3',
          ['ath3/p4.jpg', 'ath3/p5.jpg'],
          1
        )
      }
    )
    scenario(
      'editImagesBasePath keep same path nopath',
      async (scenario: StandardScenario) => {
        await testEditImagesBasePath([scenario.image.p5], '', ['p5.jpg'], 0)
      }
    )
    scenario(
      'editImagesBasePath keep same path with path',
      async (scenario: StandardScenario) => {
        await testEditImagesBasePath(
          [scenario.image.p4],
          'ath3',
          ['ath3/p4.jpg'],
          0
        )
      }
    )
    scenario(
      'editImagesBasePath remove basepath',
      async (scenario: StandardScenario) => {
        await testEditImagesBasePath([scenario.image.p4], '', ['p4.jpg'], 1)
      }
    )
    scenario(
      'editImagesBasePath with not existing id',
      async (scenario: StandardScenario) => {
        await testEditImagesBasePath(
          [scenario.image.p4, null],
          'papapapa/papap',
          ['papapapa/papap/p4.jpg'],
          1
        )
      }
    )

    scenario(
      'editImagesBasePath XOR arguments',
      async (scenario: StandardScenario) => {
        const basePath = ''
        const filter: ImageFilters = {
          tagLists: [
            {
              tagCategoryId: scenario.tagCategory.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
          ],
        }
        const imageIds = ['a', 'b']

        await expect(
          editImagesBasePath({
            select: {
              filter,
              imageIds,
            },
            input: {
              basePath,
            },
          })
        ).rejects.toThrowError('need only one of imagesIds or filter')
        await expect(
          editImagesBasePath({
            select: {},
            input: {
              basePath,
            },
          })
        ).rejects.toThrowError('need either imagesIds or filter')
      }
    )
    scenario(
      'editImagesBasePath with filter',
      async (scenario: StandardScenario) => {
        const basePath = 'ww/bb'
        const expectedRemoved = [
          scenario.image.p1,
          scenario.image.p3,
          scenario.image.p5,
        ]
        for (const i in expectedRemoved) {
          const imageToEdit = expectedRemoved[i]
          await Buckets.photos.put(imageToEdit.path, imageToEdit.path)
          await Buckets.miniatures.put(imageToEdit.path, imageToEdit.path)
        }

        const filter: ImageFilters = {
          tagLists: [
            {
              tagCategoryId: scenario.tagCategory.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
          ],
        }

        const result = await editImagesBasePath({
          select: {
            filter,
          },
          input: {
            basePath,
          },
        })

        expect(result.count).toBe(expectedRemoved.length)

        for (const i in expectedRemoved) {
          const imageToEdit = expectedRemoved[i]

          const resImage = await image({ id: imageToEdit.id })
          expect(resImage.path).toEqual(
            S3Path.getPath(basePath, S3Path.getFileName(imageToEdit.path))
          )
        }
      }
    )
  })

  describe('edit', () => {
    scenario('edit rating', async (scenario: StandardScenario) => {
      const images = [scenario.image.p1, scenario.image.p2]
      const res = await editImages({
        select: {
          imageIds: images.map((i) => i.id),
        },
        input: {
          rating: 3,
        },
      })
      expect(res.count).toBe(2)
      const i1 = await image({ id: images[0].id })
      const i2 = await image({ id: images[1].id })

      expect(i1.rating).toBe(3)
      expect(i2.rating).toBe(3)
    })

    scenario('edit rating from filter', async (scenario: StandardScenario) => {
      const images = [scenario.image.p4, scenario.image.p5]
      const filter: ImageFilters = {
        rating: {
          value: 4,
          condition: 'gte',
        },
      }
      const res = await editImages({
        select: {
          filter,
        },
        input: {
          rating: 3,
        },
      })
      expect(res.count).toBe(2)
      const i1 = await image({ id: images[0].id })
      const i2 = await image({ id: images[1].id })

      expect(i1.rating).toBe(3)
      expect(i2.rating).toBe(3)
    })

    scenario(
      'edit images XOR arguments',
      async (scenario: StandardScenario) => {
        const filter: ImageFilters = {
          tagLists: [
            {
              tagCategoryId: scenario.tagCategory.one.id,
              tagIds: [scenario.tag.g1t1.id],
              condition: 'OR',
            },
          ],
        }
        const imageIds = ['a', 'b']

        await expect(
          editImages({
            select: {
              filter,
              imageIds,
            },
            input: {
              rating: 0,
            },
          })
        ).rejects.toThrowError('need only one of imagesIds or filter')
        await expect(
          editImages({
            select: {},
            input: {
              rating: 0,
            },
          })
        ).rejects.toThrowError('need either imagesIds or filter')
      }
    )
  })
})
