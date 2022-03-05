export const standard = defineScenario({
  tagCategory: {
    one: {
      data: {
        name: 'TG1',
      },
    },
    two: {
      data: {
        name: 'TG2',
      },
    },
  },
  tag: {
    g1t1: (scenario) => ({
      data: {
        name: 'g1t1',
        tagCategoryId: scenario.tagCategory.one.id,
      },
    }),
    g1t2: (scenario) => ({
      data: {
        name: 'g1t2',
        tagCategoryId: scenario.tagCategory.one.id,
      },
    }),
    g1t3: (scenario) => ({
      data: {
        name: 'g1t3',
        tagCategoryId: scenario.tagCategory.one.id,
      },
    }),
    g2t1: (scenario) => ({
      data: {
        name: 'g2t1',
        tagCategoryId: scenario.tagCategory.two.id,
      },
    }),
    g2t2: (scenario) => ({
      data: {
        name: 'g2t2',
        tagCategoryId: scenario.tagCategory.two.id,
      },
    }),
    g2t3: (scenario) => ({
      data: {
        name: 'g2t3',
        tagCategoryId: scenario.tagCategory.two.id,
      },
    }),
  },

  image: {
    p1: (scenario) => ({
      data: {
        path: 'p1.jpg',
        dateTaken: '2022-01-01T00:01:00Z',
        rating: 1,
        tagsOnImages: {
          create: [
            {
              tagId: scenario.tag.g1t1.id,
            },
            {
              tagId: scenario.tag.g2t1.id,
            },
          ],
        },
      },
    }),
    p2: (scenario) => ({
      data: {
        path: 'ath1/p2.jpg',
        dateTaken: '2022-01-01T00:02:00Z',
        rating: 2,
        tagsOnImages: {
          create: [
            {
              tagId: scenario.tag.g1t2.id,
            },
            {
              tagId: scenario.tag.g2t2.id,
            },
          ],
        },
      },
    }),
    p3: (scenario) => ({
      data: {
        path: 'ath1/ath2/p3.jpg',
        rating: 3,
        dateTaken: '2022-01-01T00:03:00Z',
        tagsOnImages: {
          create: [
            {
              tagId: scenario.tag.g1t1.id,
            },
            {
              tagId: scenario.tag.g2t2.id,
            },
          ],
        },
      },
    }),
    p4: (scenario) => ({
      data: {
        path: 'ath3/p4.jpg',
        rating: 4,
        dateTaken: '2022-01-01T00:04:00Z',
        tagsOnImages: {
          create: [
            {
              tagId: scenario.tag.g1t2.id,
            },
            {
              tagId: scenario.tag.g2t1.id,
            },
          ],
        },
      },
    }),
    p5: (scenario) => ({
      data: {
        rating: 5,
        path: 'p5.jpg',
        dateTaken: '2022-01-01T00:05:00Z',
        tagsOnImages: {
          create: [
            {
              tagId: scenario.tag.g1t1.id,
            },
            {
              tagId: scenario.tag.g2t2.id,
            },
            {
              tagId: scenario.tag.g2t3.id,
            },
          ],
        },
      },
    }),
    notag: {
      data: {
        path: 'notag.jpg',
        dateTaken: '2022-01-02T00:00:00Z',
      },
    },
  },
})

export type StandardScenario = typeof standard
