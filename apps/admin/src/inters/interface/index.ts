import type { WithId } from '@3un/shared'
import * as z from 'zod'

export const zInterface = z.interface({
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
  apiType: z.number().default(0),
  // userId: z.number().default(0),
  // userName: z.string().default(''),
})

