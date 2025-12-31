import z from 'zod/v4'

import { ACTIVITY_STATUS, ACTIVITY_TRIGGER_TYPE } from '@3un/utils'
import type { WithId } from '@3un/shared'

export const zActivity = z.object({
  id: z.number(),
  name: z.string(),
  status: z.enum(ACTIVITY_STATUS),
  triggerType: z.enum(ACTIVITY_TRIGGER_TYPE),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const zActivitySearch = z.object({
  activityName: z.string().optional(),
  status: z.enum(ACTIVITY_STATUS).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  triggerType: z.enum(ACTIVITY_TRIGGER_TYPE).optional(),
})

export const zActivityForm = z.object({
  name: z.string().default(""),
  startTime: z.string().default(""),
  endTime: z.string().default(""),
  status: z.enum(ACTIVITY_STATUS).default(ACTIVITY_STATUS.ENABLE),
  triggerType: z.enum(ACTIVITY_TRIGGER_TYPE).default(ACTIVITY_TRIGGER_TYPE.RECHARGE),
  description: z.string().default(""),
})

export type Activity = z.infer<typeof zActivity>
export type ActivitySearch = z.infer<typeof zActivitySearch>
export type ActivityCreate = z.infer<typeof zActivityForm>
export type ActivityUpdate = WithId<ActivityCreate, "id">
