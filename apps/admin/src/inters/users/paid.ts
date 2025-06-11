import type { IList, IPage, WithId } from '@3un/shared'
import { z } from 'zod/v4'

export const zUserPaid = z.object({
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

// Search
export const zUserPaidSearchForm = z.object({
  userId: z.number().optional(),
  openId: z.string().optional(),
  username: z.string().optional(),
  nickname: z.string().optional(),
})

export type UserPaidSearchForm = z.infer<typeof zUserPaidSearchForm>

// List
export interface UserPaidListParams extends IPage, UserPaidSearchForm {}
export type UserPaidList = IList<UserPaid>

// Form
export const zUserPaidForm = zUserPaid.omit({ userId: true })

// Create & Update
export type UserPaidCreateParams = z.infer<typeof zUserPaidForm>
export type UserPaidUpdateParams = WithId<UserPaidCreateParams, 'userId'>
