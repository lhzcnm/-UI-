import type { IPage } from '@3un/shared'
import { ORDER_STATUS } from '@3un/utils'
import z from 'zod/v4'

export const zOrder = z.object({
  id: z.number(),
  serviceId: z.number(),
  status: z.enum(ORDER_STATUS),
  imei: z.string(),
  credits: z.number(),
  remark: z.string(),
  result: z.string(),
  createTime: z.string(),
})

export const zOrderSearch = z.object({
  serviceId: z.number().optional(),
  groupId: z.number().optional(),
  imeiList: z.array(z.string()).optional(),
  codeIdList: z.array(z.string()).optional(),
})

export const zOrderPay = z.object({
  id: z.string().default(''),
  amount: z.number().default(0),
  type: z.string().default(''),
  openId: z.string().optional(),
})

export const zOrderForm = z.object({
  imei: z.string().default(''),
  pushRes: z.boolean().default(true),
  phone: z.string().default(''),
  mail: z.string().default(''),
})

export const zOrderView = z.object({
  id: z.number(),
  serviceId: z.number(),
  status: z.enum(ORDER_STATUS),
  imei: z.string(),
  result: z.string(),
  createTime: z.string(),
})

export const zSubmitParams = z.object({
  serviceId: z.string().default(''),
  groupId: z.string().default(''),
  imeiList: z.array(z.string()).default([]),
  isPushNotification: z.boolean().default(true),
  phoneNumber: z.string().default(''),
  email: z.string().default(''),
  isBulk: z.boolean().default(false),
})

export const zSubmitResp = z.object({
  codeId: z.number().nullable(),
  imei: z.string(),
  status: z.enum(ORDER_STATUS),
  message: z.string().nullable(),
})

export const zRefreshParams = z.object({
  serviceId: z.number().optional(),
  codeIdList: z.array(z.number()).optional(),
  showAll: z.boolean().default(false),
})

// export const zSubmitStorage = z.object({
//   serviceId: z.number(),
//   imeis: z.array(z.string()),
// })

export type Order = z.infer<typeof zOrder>
export type OrderSearch = z.infer<typeof zOrderSearch>
export type OrderPayParams = z.infer<typeof zOrderPay>
export type OrderForm = z.infer<typeof zOrderForm>
export type OrderView = z.infer<typeof zOrderView>
export type SubmitParams = z.infer<typeof zSubmitParams>
export type SubmitResp = z.infer<typeof zSubmitResp>
export type RefreshParams = z.infer<typeof zRefreshParams>
// export type SubmitStorage = z.infer<typeof zSubmitStorage>

export type OrderSearchForm = IPage & OrderSearch
