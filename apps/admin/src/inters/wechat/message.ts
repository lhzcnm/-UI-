import type { WithId } from '@3un/shared'
import * as z from 'zod'

export interface BuiltInMessage {
  id: number
  keywords: string
  label: string
  content1: string
  content2: string
  hasKeywords: boolean
  createTime: string
  updateTime: string
}

// Update
export type BuiltInMsgUpdateParams = WithId<BuiltInMessage, 'id'>

// Custom Message
export const zCustomMessage = z.interface({
  id: z.number().default(0),
  keywords: z.string().default(''),
  content: z.string().default(''),
  createTime: z.string().default(''),
  updateTime: z.string().default(''),
})

export type CustomMessage = z.infer<typeof zCustomMessage>

// Form
export const zCustomMessageForm = z.interface({
  keywords: z.string().default(''),
  content: z.string().default(''),
})

// Create & Update
export type CustomMessageCreateParams = z.infer<typeof zCustomMessageForm>
export type CustomMessageUpdateParams = WithId<CustomMessageCreateParams, 'id'>
