import type { WithId } from '@3un/shared'
import * as z from 'zod'

export type ServiceGroup = z.infer<typeof zServiceGroup>
export const zServiceGroup = z.interface({
  categoryId: z.number().default(0),
  category: z.string().default(''),
  categoryLocal: z.string().default(''),
  orderBy: z.number().default(0),
  disableCategory: z.number().default(0),

  // ⬇️ 废弃字段
  // htmlTitle: z.string().default(''),
  // metaKw: z.string().default(''),
  // metaTags: z.string().default(''),
  // seoUrlName: z.string().default(''),
})

// Form
export const zServiceGroupForm = zServiceGroup.omit({ categoryId: true })

// Create & Update
export type ServiceGroupCreateParams = z.infer<typeof zServiceGroupForm>
export type ServiceGroupUpdateParams = WithId<ServiceGroupCreateParams, 'categoryId'>
