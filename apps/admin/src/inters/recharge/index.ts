import type { IList, IPage } from '@3un/shared'
import { PAYMENT_METHOD, PAYMENT_STATUS } from '@3un/utils'
import { z } from 'zod/v4'

export * from './package'

export const zRecharge = z.object({
  paymentId: z.number().default(0),
  userId: z.number().default(0),
  credits: z.string().default(''),
  paymentMethod: z.enum(PAYMENT_METHOD).default(PAYMENT_METHOD.ADMIN),
  paymentStatus: z.enum(PAYMENT_STATUS).default(PAYMENT_STATUS.UNPAID),
  paymentDtTm: z.string().default(''),
  transactionId: z.string().nullable().default(''),
  creditsTransferred: z.boolean().default(false),
  comments: z.string().nullable(),
  updatedAt: z.string().default(''),
  amount: z.string().default(''),
  // payable: z.boolean().default(false),
  // currency: z.string().default(''),
  // payerEmail: z.string().default(''),
  // receiverEmail: z.string().default(''),
  // codeId: z.string().default(''),
  byAdmin: z.boolean().default(false),
  invoiceTime: z.string().default(''),
  shopId: z.number().default(0),
})

export type Recharge = z.infer<typeof zRecharge>

// Search
export const zRechargeSearchForm = z.object({
  userId: z.number().optional(),
  transactionId: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHOD).optional(),
  paymentStatus: z.enum(PAYMENT_STATUS).optional(),
  byAdmin: z.boolean().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
})

export const zRechargeHandleFee = z.object({
  // alipay
  aliFee: z.string().default(''),
  aliThreshold: z.string().default(''),
  // wechat
  wxFee: z.string().default(''),
  wxThreshold: z.string().default('')
})

export type RechargeSearchForm = z.infer<typeof zRechargeSearchForm>

export type RechargeHandleFee = z.infer<typeof zRechargeHandleFee>

// List
export type RechargeList = IList<Recharge>
export interface RechargeListParams extends IPage, RechargeSearchForm {}

// Update
export interface RechargeUpdateParams {
  paymentId: number
  userId: number
  paymentStatus?: PAYMENT_STATUS
  paymentMethod?: PAYMENT_METHOD
  comments?: string
  byAdmin?: boolean
}
