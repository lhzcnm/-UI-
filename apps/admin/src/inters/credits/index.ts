import type { IList, IPage } from "@3un/shared"
import { VERIFY_MSG } from '@/utils/message'
import { z } from 'zod/v4'

export const zCredit = z.object({
  historyId: z.number().default(0),
  userId: z.number().default(0),
  imeiNo: z.string().default(''),
  packageId: z.number().default(0),
  historyDtTm: z.string().default(''),
  description: z.string().default(''),
  credits: z.number().default(0),
  creditsLeft: z.string().default(''),
  comments: z.string().nullable(),
  ip: z.string().nullable(),
})

export type Credit = z.infer<typeof zCredit>

// Search
export const zCreditSearchForm = z.object({
  imeiNo: z.string().optional(),
  userId: z.number(VERIFY_MSG.USER_ID).optional(),
  serviceId: z.number().optional(),
})

export type CreditSearchForm = z.infer<typeof zCreditSearchForm>
type OmitImeiNo = Omit<CreditSearchForm, 'imeiNo'>

// List
export type CreditList = IList<Credit>
export interface CreditListParams extends IPage, OmitImeiNo {
  imeiNo: string[] | undefined
}
