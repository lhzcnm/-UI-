import type { WithId } from '@3un/shared'
import { VERIFY_MSG } from '@/utils'
import { z } from 'zod/v4'

export const zBuiltInMsg = z.object({
  id: z.number().default(0),
  keywords: z.string().default(''),
  label: z.string().default(''),
  hasKeywords: z.boolean().default(false),
  content1: z.string().nullable().default(null),
  content2: z.string().nullable().default(null),
})

// Custom Message
export const zCustomMsg = z.object({
  id: z.number().default(0),
  keywords: z.string().default(''),
  content: z.string().default(''),
  // createTime: z.string().default(''),
  // updateTime: z.string().default(''),
})

export type BuiltInMessage = z.infer<typeof zBuiltInMsg>
export type CustomMsg = z.infer<typeof zCustomMsg>

// Form
export const zCustomMsgForm = z.object({
  keywords: z.string().min(1, VERIFY_MSG.REQ_MSG_KEYWORDS).default(''),
  content: z.string().min(1, VERIFY_MSG.REQ_MSG_CONTENT).default(''),
})

// Create & Update
export type CustomMsgCreateParams = z.infer<typeof zCustomMsgForm>
export type CustomMsgUpdateParams = WithId<CustomMsgCreateParams, 'id'>

export type BuiltInMsgUpdateParams = WithId<BuiltInMessage, 'id'>
