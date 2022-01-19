import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.TagImageCreateArgs>({
  tagImage: {
    one: {
      data: {
        tag: {
          create: { name: 'String', tagGroup: { create: { name: 'String' } } },
        },
        image: {
          create: {
            path: 'String',
            dateTaken: '2022-01-19T20:21:32Z',
            dateEdited: '2022-01-19T20:21:32Z',
            metadataJson: 'String',
          },
        },
      },
    },
    two: {
      data: {
        tag: {
          create: { name: 'String', tagGroup: { create: { name: 'String' } } },
        },
        image: {
          create: {
            path: 'String',
            dateTaken: '2022-01-19T20:21:32Z',
            dateEdited: '2022-01-19T20:21:32Z',
            metadataJson: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
