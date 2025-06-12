import type { WithId } from '@3un/shared'
import { VERIFY_MSG } from '@/utils/message'
import { z } from 'zod/v4'

const zUnlockConvertCode = z.object({
  key: z.string().default(''),
  value: z.string().default(''),
})

export const zUnlock = z.object({
  id: z.number().default(0),
  packageId: z.number()
    .refine((val) => val > 0, VERIFY_MSG.REQ_SERVICE_ID)
    .default(0),

  name: z.string()
    .min(1, VERIFY_MSG.REQ_SERVICE_NAME)
    .default(''),

  operator: z.string()
    .min(1, VERIFY_MSG.REQ_OPERATOR)
    .default(''),

  convertCode: z.array(zUnlockConvertCode).default([]),
})

export type Unlock = z.infer<typeof zUnlock>

// Form
export const zUnlockForm = zUnlock.omit({ id: true })

// Create & Update
export type UnlockCreateParams = z.infer<typeof zUnlockForm>
export type UnlockUpdateParams = WithId<UnlockCreateParams, 'id'>
