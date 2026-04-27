import { PAYMENT_METHOD, PAYMENT_STATUS } from '@3un/utils'
import { z } from 'zod/v4'
import type { IList } from '../common'

export interface RangeStatParams {
  serviceId?: number
  startTime?: string
  endTime?: string
}

export interface OrderStatItem {
  total: number
  failure: number
  success: number
  dataTime: string
}

export interface TodoCountItem {
  ticket    : number
  awaiting  : number
  verifying : number
  processing: number
}

export interface UserStatItem {
  today: number
  total: number
  yesterday: number
}

export interface RechargeTodayParams {
  page: number,
  pageSize: number,
  startTime: string,
  endTime: string,
}

export const zRechargeTodayItem = z.object({
  paymentId: z.number(),
  amount: z.string(),
  paymentStatus: z.enum(PAYMENT_STATUS),
  paymentMethod: z.enum(PAYMENT_METHOD),
  credits: z.string(),
  userId: z.number(),
  nickName: z.string(),
  headImgUrl: z.string().nullable(),
})

export type RechargeTodayItem = z.infer<typeof zRechargeTodayItem>
export type RechargeTodayList = IList<RechargeTodayItem>
