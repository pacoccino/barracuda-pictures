export const standard = defineScenario({
  tagGroup: {
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
        tagGroupId: scenario.tagGroup.one.id,
      },
    }),
    g1t2: (scenario) => ({
      data: {
        name: 'g1t2',
        tagGroupId: scenario.tagGroup.one.id,
      },
    }),
    g2t1: (scenario) => ({
      data: {
        name: 'g2t1',
        tagGroupId: scenario.tagGroup.two.id,
      },
    }),
    g2t2: (scenario) => ({
      data: {
        name: 'g2t2',
        tagGroupId: scenario.tagGroup.two.id,
      },
    }),
  },

  image: {
    p1: (scenario) => ({
      data: {
        path: 'p1.jpg',
        dateTaken: '2022-01-01T00:01:00Z',
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
        path: 'p2.jpg',
        dateTaken: '2022-01-01T00:02:00Z',
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
  },
})

export type StandardScenario = typeof standard
