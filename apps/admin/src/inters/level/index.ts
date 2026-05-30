import { PLAN_TYPE_ENUM } from '@/utils/enum'
import type { WithId } from '@3un/shared'
import { ACCESS_LEVEL } from '@3un/utils'
import { z } from 'zod/v4'

export * from './service'

export const zLevel = z.object({
  pricePlanId: z.number().default(0),
  pricePlan: z.string().min(1, '等级名称不能为空').default(''),
  pricePlanLocal: z.string().min(1, '等级名称EN不能为空').default(''),
  disablePricePlan: z.boolean().default(false),
  enableDevice: z.boolean().default(false),
  // isDel: z.boolean().default(false),
  // updateTime: z.string().default(''),
  // createTime: z.string().default(''),
  // updateByUserId: z.string().default(''),
  
  // member permission
  accessLevel: z.enum(ACCESS_LEVEL).default(ACCESS_LEVEL.BASIC),
  // 会员等级升级所需充值金额
  thresholdAmount: z.number().default(0),
  upgradeType: z.enum(PLAN_TYPE_ENUM).default(PLAN_TYPE_ENUM.SUBSCRIPTION),
})

export type Level = z.infer<typeof zLevel>

// Form
export const zLevelForm = zLevel.omit({ pricePlanId: true })

// Create & Update
export type LevelCreateParams = z.infer<typeof zLevelForm>
export type LevelUpdateParams = WithId<LevelCreateParams, 'pricePlanId'>
