import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.TagCreateArgs>({
  tag: {
    one: { data: { name: 'String', tagGroup: { create: { name: 'String' } } } },
    two: { data: { name: 'String', tagGroup: { create: { name: 'String' } } } },
  },
})

export type StandardScenario = typeof standard
