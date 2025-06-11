import type { WithId } from '@3un/shared'
import { z } from 'zod/v4'

export const zIntercept = z.object({
  id: z.number().default(0),
  ip: z.ipv4().default('unknown'),
  comments: z.string().default(''),
  createTime: z.string().default(''),
  expireTime: z.string().nullable().default(null),
})

export type Intercept = z.infer<typeof zIntercept>

// Form
export const zInterceptForm = zIntercept.omit({
  createTime: true,
  id: true,
})

export type InterceptForm = z.infer<typeof zInterceptForm>

// Create & Update
export type InterceptCreateParams = z.infer<typeof zInterceptForm>
export type InterceptUpdateParams = WithId<InterceptCreateParams, 'id'>
