import type { IList, WithId, IPage } from '@3un/shared'
import { PAYMENT_METHOD } from '@3un/shared/enums'
import * as z from 'zod'

export * from './extra'
export * from './paid'
export * from './service'

export const zUser = z.interface({
  userId: z.number().default(0),
  userName: z.string().default(''),
  // firstName: z.string().nullable().default(null),
  // lastName: z.string().nullable().default(null),
  userPassword: z.string().default(''),
  // countryId: z.number().default(0),
  phone: z.string().nullable().default(null),
  addedAt: z.string().default(''),
  // updatedAt: z.string().default(''),
  // addedBy: z.number().nullable().default(null),
  // updatedBy: z.number().nullable().default(null),
  comments: z.string().nullable().default(null),
  disableUser: z.boolean().default(false),
  // address: z.string().nullable().default(null),
  // city: z.string().nullable().default(null),
  // state: z.string().nullable().default(null),
  // zip: z.string().nullable().default(null),
  // fax: z.string().nullable().default(null),
  // company: z.string().nullable().default(null),
  credits: z.string().default(''),
  autoFillCredits: z.boolean().default(false),
  // currencyId: z.number().default(0),
  pricePlanId: z.number().default(0),
  // listId: z.number().default(0),
  apiKey: z.string().default(''),
  // prPlanOfferId: z.number().nullable().default(null),
  allowNegativeCredits: z.boolean().default(false),
  // currencyConversion: z.boolean().default(false),
  userType: z.boolean().default(false),
  ip: z.string().nullable().default(null),
  allowApi: z.boolean().default(false),
  loginAttempts: z.boolean().default(false),
  userEmail: z.string().nullable().default(null),
  loginAllowedFromOtherCountry: z.boolean().default(true),
  // userLang: z.string().default(''),
  passwordUpdatedAt: z.string().nullable().default(null),
  weiXinOpenid: z.string().nullable().default(null),
  inviteCode: z.string().nullable().default(null),
  inviteByUserid: z.number().nullable().default(null),
  pushMsg: z.boolean().default(true),
  // oldPricePlanId: z.number().default(0),
  memberExp: z.string().nullable().default(null),
  bulkCheckApi: z.string().nullable().default(null),
  headImgUrl: z.string().nullable().default(null),
  nickName: z.string().nullable().default(null),
  role: z.number().default(0),
  ips: z.string().nullable().default(null),
  // opanStartDt: z.string().nullable().default(null),
  // opanEndDt: z.string().nullable().default(null),
})

export type User = z.infer<typeof zUser>

// Search
export const zUserSearchForm = z.interface({
  userId: z.number().nullable().default(null),
  pricePlanId: z.number().nullable().default(null),
  userName: z.string().default(''),
  nickName: z.string().default(''),
  winxOpenid: z.string().default(''),
})

export type UserSearchForm = z.infer<typeof zUserSearchForm>

// List
export type UserList = IList<User>
export interface UserListParams extends IPage {
  userId?: number
  pricePlanId?: number
  userName?: string
  nickName?: string
  winxOpenid?: string
}

// Form
export const zUserForm = zUser.omit({
  passwordUpdatedAt: true,
  userId: true,
  addedAt: true,
})

// Create & Update
export type UserCreateParams = z.infer<typeof zUserForm>
export type UserUpdateParams = WithId<UserCreateParams, 'userId'>

// Point
export const zUserPointForm = z.interface({
  userId: z.number().default(0),
  isAdd: z.boolean().default(true),
  isPay: z.boolean().default(false),
  credits: z.number().default(0),
  paymentMethod: z.enum(PAYMENT_METHOD).default(PAYMENT_METHOD.ADMIN),
  transactionId: z.string().default(''),
  comments: z.string().default(''),
  invoices: z.boolean().default(true),
})

export type UserPointForm = z.infer<typeof zUserPointForm>
