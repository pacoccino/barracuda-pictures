import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.TagsOnImageCreateArgs>({
  tagsOnImage: {
    one: {
      data: {
        tag: {
          create: { name: 'String', tagGroup: { create: { name: 'String' } } },
        },
        image: {
          create: {
            path: 'String',
            dateTaken: '2022-01-22T10:44:13Z',
            dateEdited: '2022-01-22T10:44:13Z',
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
            dateTaken: '2022-01-22T10:44:13Z',
            dateEdited: '2022-01-22T10:44:13Z',
            metadataJson: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = typeof standard
