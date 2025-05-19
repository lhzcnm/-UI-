import type { WithId } from '@3un/shared'
import * as z from 'zod'

export * from './service'

export const zLevel = z.interface({
  pricePlanId: z.number().default(0),
  pricePlan: z.string().default(''),
  pricePlanLocal: z.string().default(''),
  disablePricePlan: z.boolean().default(false),
  // isDel: z.boolean().default(false),
  // updateTime: z.string().default(''),
  // createTime: z.string().default(''),
  // updateByUserId: z.string().default(''),
})

export type Level = z.infer<typeof zLevel>

// Form
export const zLevelForm = zLevel.omit({ pricePlanId: true })

// Create & Update
export type LevelCreateParams = z.infer<typeof zLevelForm>
export type LevelUpdateParams = WithId<LevelCreateParams, 'pricePlanId'>
