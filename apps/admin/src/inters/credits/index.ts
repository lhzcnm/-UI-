import type { IList, IPage } from "@3un/shared"
import * as z from "zod"

// {
//   "userId": 29590,
//   "imeiNo": "FCCR130UGRWQ",
//   "packageId": 1037,
//   "historyDtTm": "2023-07-29 00:00:12",
//   "description": "Wexin Code Request",
//   "credits": 0.15,
//   "creditsLeft": "lMaJaw==",
//   "comments": null,
//   "ip": "81.69.101.237"
// }

export const zCredit = z.interface({
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
export const zCreditSearchForm = z.interface({
  imeiNo: z.string().optional(),
  userId: z.number().optional(),
  serviceId: z.number().optional(),
})

export type CreditSearchForm = z.infer<typeof zCreditSearchForm>
type OmitImeiNo = Omit<CreditSearchForm, 'imeiNo'>

// List
export type CreditList = IList<Credit>
export interface CreditListParams extends IPage, OmitImeiNo {
  imeiNo: string[] | undefined
}
