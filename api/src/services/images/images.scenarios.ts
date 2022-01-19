import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.ImageCreateArgs>({
  image: {
    one: {
      data: {
        path: 'String',
        dateTaken: '2022-01-19T20:22:47Z',
        dateEdited: '2022-01-19T20:22:47Z',
        metadataJson: 'String',
      },
    },
    two: {
      data: {
        path: 'String',
        dateTaken: '2022-01-19T20:22:47Z',
        dateEdited: '2022-01-19T20:22:47Z',
        metadataJson: 'String',
      },
    },
  },
})

export type StandardScenario = typeof standard
