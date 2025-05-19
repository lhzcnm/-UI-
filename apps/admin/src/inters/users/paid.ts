import type { IList, WithId } from '@3un/shared'
import * as z from 'zod'

export const zUserPaid = z.interface({
  userId: z.number().default(0),
  weixinOpenId: z.string().default(''),
  userName: z.string().default(''),
  nickName: z.string().default(''),
  memberExp: z.string().default(''),
  payTime: z.string().default(''),
  remark: z.string().nullable().default(null),
  // addedAt: z.string().default(''),
})

export type UserPaid = z.infer<typeof zUserPaid>

// Search & List
export const zUserPaidSearchForm = z.interface({
  userId: z.number().nullable().default(null),
  weixinOpenId: z.string().default(''),
  userName: z.string().default(''),
  nickName: z.string().default(''),
})

export type UserPaidSearchForm = z.infer<typeof zUserPaidSearchForm>
export type UserPaidList = IList<UserPaid>

// Form
export const zUserPaidForm = zUserPaid.omit({ userId: true })

// Create & Update
export type UserPaidCreateParams = z.infer<typeof zUserPaidForm>
export type UserPaidUpdateParams = WithId<UserPaidCreateParams, 'userId'>
