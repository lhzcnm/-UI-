import type { WithId } from '@3un/shared'
import * as z from 'zod'

export const zBuiltInMsg = z.interface({
  id: z.number().default(0),
  keywords: z.string().default(''),
  label: z.string().default(''),
  hasKeywords: z.boolean().default(false),
  content1: z.string().nullable().default(null),
  content2: z.string().nullable().default(null),
})

// Custom Message
export const zCustomMsg = z.interface({
  id: z.number().default(0),
  keywords: z.string().default(''),
  content: z.string().default(''),
  // createTime: z.string().default(''),
  // updateTime: z.string().default(''),
})

export type BuiltInMessage = z.infer<typeof zBuiltInMsg>
export type CustomMsg = z.infer<typeof zCustomMsg>

// Form
export const zCustomMsgForm = z.interface({
  keywords: z.string().default(''),
  content: z.string().default(''),
})

// Create & Update
export type CustomMsgCreateParams = z.infer<typeof zCustomMsgForm>
export type CustomMsgUpdateParams = WithId<CustomMsgCreateParams, 'id'>

export type BuiltInMsgUpdateParams = WithId<BuiltInMessage, 'id'>
