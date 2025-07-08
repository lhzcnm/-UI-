import type { IList, WithId, IPage } from '@3un/shared'
import { PAYMENT_METHOD, USER_ROLE } from '@3un/utils'
import { z } from 'zod/v4'

export * from './extra'
export * from './paid'
export * from './service'
export * from './admin'

export const zUser = z.object({
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
  apiKey: z.string().nullable().default(null),
  // prPlanOfferId: z.number().nullable().default(null),
  allowNegativeCredits: z.boolean().default(false),
  // currencyConversion: z.boolean().default(false),
  userType: z.boolean().default(false),
  
  // 登录白名单
  ip: z.string()
    .transform((val) => val.replace(',', '\n'))
    .nullable().default(null),

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
  role: z.enum(USER_ROLE).default(USER_ROLE.USER),

  // API 白名单
  ips: z.string()
    .transform((val) => val.replace(',', '\n'))
    .nullable().default(null),

  // opanStartDt: z.string().nullable().default(null),
  // opanEndDt: z.string().nullable().default(null),
})

export type User = z.infer<typeof zUser>

// Search
export const zUserSearchForm = z.object({
  userId: z.number().optional(),
  planId: z.number().optional(),
  username: z.string().optional(),
  nickname: z.string().optional(),
  openId: z.string().optional(),
  isAdmin: z.boolean().default(false),
})

export type UserSearchForm = z.infer<typeof zUserSearchForm>

// List
export type UserList = IList<User>
export interface UserListParams extends IPage, UserSearchForm {}

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
export const zUserPointForm = z.object({
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
