import type { WithId } from '@3un/shared'
import { VERIFY_MSG } from '@/utils'
import { z } from 'zod/v4'

export const zRechargePackage = z.object({
  id: z.number().default(0),
  planId: z.number().default(0),
  shopName: z.string().default(''),
  price: z.string().default("1"),
  month: z.number().default(1),
  createTime: z.string().default(''),
})

export type RechargePackage = z.infer<typeof zRechargePackage>

// Form
export const zRechargePackageForm = z.object({
  shopName: z.string().min(1, VERIFY_MSG.REQ_SHOP_NAME).default(''),
  planId: z.number().default(0),
  price: z.number().default(1),
  month: z.number().default(1),
})

export type RechargePackageForm = z.infer<typeof zRechargePackageForm>

// Create & Update
export type RechargePackageCreateParams = z.infer<typeof zRechargePackageForm>
export type RechargePackageUpdateParams = WithId<RechargePackageCreateParams, 'id'>
