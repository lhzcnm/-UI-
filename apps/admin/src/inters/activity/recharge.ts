import { z } from "zod/v4"
import type { IList } from "../common"
import { PAYMENT_STATUS } from "@3un/utils"

export const zActivyRecharge = z.object({
  paymentId: z.number().default(0),
  userId: z.number().default(0),
  credits: z.string().default(''),
  nonce: z.string().nullable().default(""),
  amount: z.string().default(''),
  paymentStatus: z.enum(PAYMENT_STATUS).default(PAYMENT_STATUS.UNPAID),
  voucherCode: z.string().default("").nullable(),
  invoiceTime: z.string().default(""),
})

export type ActivyRecharge = z.infer<typeof zActivyRecharge>

export type ActivyRechargeList = IList<ActivyRecharge>
