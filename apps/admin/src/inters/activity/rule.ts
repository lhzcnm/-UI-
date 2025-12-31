import type { WithId } from "@3un/shared"
import { ACTIVITY_BONUS } from "@3un/utils"
import z from "zod/v4"

export const zActivityRule = z.object({
  id: z.number(),
  activityId: z.number(),
  minAmount: z.string(),
  bonusAmount: z.string(),
  bonusType: z.enum(ACTIVITY_BONUS),
  createdAt: z.string(),
  updatedAt: z.string(),
  sortOrder: z.number(),
})

export const zActivityRuleForm = z.object({
  activityId: z.number(),
  minAmount: z.string().default("100"),
  bonusAmount: z.string().default("10"),
  bonusType: z.enum(ACTIVITY_BONUS).default(ACTIVITY_BONUS.GIFT_QUERY),
  sortOrder: z.number().default(1),
})

export type ActivityRule = z.infer<typeof zActivityRule>
export type ActivityRuleCreate = z.infer<typeof zActivityRuleForm>
export type ActivityRuleUpdate = WithId<ActivityRuleCreate, "id">
