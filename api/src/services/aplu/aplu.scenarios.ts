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
    g1t3: (scenario) => ({
      data: {
        name: 'g1t3',
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
    g2t3: (scenario) => ({
      data: {
        name: 'g2t3',
        tagGroupId: scenario.tagGroup.two.id,
      },
    }),
  },

  image: {
    p1: (scenario) => ({
      data: {
        path: 'p1.jpg',
        dateTaken: '2001-01-01T00:01:00Z',
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
        dateTaken: '2001-01-01T00:02:00Z',
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
        dateTaken: '2001-02-02T00:03:00Z',
        rating: 3,
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
        dateTaken: '2002-01-01T00:04:00Z',
        rating: 4,
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
        path: 'p5.jpg',
        dateTaken: '2004-03-01T00:05:00Z',
        rating: 5,
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
        dateTaken: '2004-03-02T00:00:00Z',
      },
    },
  },
})

export type StandardScenario = typeof standard
