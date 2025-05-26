import type { WithId } from '@3un/shared'
import { API_TYPE } from '@3un/utils'
import * as z from 'zod'

export const zUpstream = z.interface({
  apiId: z.number().default(0),
  apiTitle: z.string().default(''),
  disableApi: z.boolean().default(false),
  apiKey: z.string().default(''),
  serverUrl: z.string().default(''),
  accountId: z.string().default(''),
  // apiAction: z.string().default(''),
  // responseUrl: z.string().default(''),
  // serviceId: z.string().default(''),
  // sendExternalId: z.number().default(0),
  apiType: z.enum(API_TYPE).default(API_TYPE.REALTIME),
  // userId: z.number().default(0),
  // userName: z.string().default(''),
})

export type Upstream = z.infer<typeof zUpstream>

// Form
export const zUpstreamForm = zUpstream.omit({ apiId: true })

// Create & Update
export type UpstreamCreateParams = z.infer<typeof zUpstreamForm>
export type UpstreamUpdateParams = WithId<UpstreamCreateParams, 'apiId'>
