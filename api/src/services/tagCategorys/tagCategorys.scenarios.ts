import type { Prisma } from '@prisma/client'

export const standard = defineScenario<Prisma.TagCategoryCreateArgs>({
  tagCategory: {
    one: { data: { name: 'TG1' } },
    two: { data: { name: 'TG2' } },
  },
})

export type StandardScenario = typeof standard
