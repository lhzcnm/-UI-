import type { IList, IPage } from '@3un/shared'
import { VOUCHER_STATUS, VOUCHER_ENUM, VOUCHER_TYPE } from '@3un/utils'
import z from 'zod/v4'

export const zVoucher = z.object({
  id: z.number(),
  code: z.string(),
  userId: z.number().nullable(),
  amount: z.string(),
  expireTs: z.number(),
  status: z.enum(VOUCHER_STATUS).default(VOUCHER_STATUS.USEFUL),
  useTime: z.string().nullable(),
  createTime: z.string(),
  type: z.enum(VOUCHER_ENUM).default(VOUCHER_ENUM.COMMON),
  creditsUsageType: z.enum(VOUCHER_TYPE).default(VOUCHER_TYPE.COMMON),
})

export const zVoucherSearchForm = z.object({
  userId: z.number().optional(),
})

export const zVoucherCreate = z.object({
  amount: z.number().default(0),
  // userId: z.number().optional(),
  day: z.string().default('7'),
  type: z.enum(VOUCHER_ENUM).default(VOUCHER_ENUM.COMMON),
  creditsUsageType: z.enum(VOUCHER_TYPE).default(VOUCHER_TYPE.COMMON),
})

export const zVoucherUpdate = zVoucher.pick({
  code: true,
  status: true,
})

export type Voucher = z.infer<typeof zVoucher>
export type VoucherSearchForm = z.infer<typeof zVoucherSearchForm>
export type VoucherCreateForm = z.infer<typeof zVoucherCreate>
export type VoucherUpdateForm = z.infer<typeof zVoucherUpdate>

export type VoucherList = IList<Voucher>

// export interface VoucherList
export type VoucherListForm = VoucherSearchForm & IPage
