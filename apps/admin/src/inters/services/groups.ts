import type { WithId } from '@3un/shared'
import { VERIFY_MSG } from '@/utils/message'
import { z } from 'zod/v4'

export const zServiceGroup = z.object({
  categoryId: z.number().default(0),
  category: z.string()
    .min(1, VERIFY_MSG.REQ_CATEGORY)
    .default(''),

  categoryLocal: z.string()
    .min(1, VERIFY_MSG.REQ_CATEGORY_EN)
    .default(''),

  orderBy: z.number().default(0),
  disableCategory: z.number().default(0), 

  // ⬇️ 废弃字段
  // htmlTitle: z.string().default(''),
  // metaKw: z.string().default(''),
  // metaTags: z.string().default(''),
  // seoUrlName: z.string().default(''),
})

export type ServiceGroup = z.infer<typeof zServiceGroup>

// Form
export const zServiceGroupForm = zServiceGroup.omit({ categoryId: true })

// Create & Update
export type ServiceGroupCreateParams = z.infer<typeof zServiceGroupForm>
export type ServiceGroupUpdateParams = WithId<ServiceGroupCreateParams, 'categoryId'>
