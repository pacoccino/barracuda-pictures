import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.TagCreateArgs>({
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
})

export type StandardScenario = typeof standard
