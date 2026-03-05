import type { RECHARGE_TYPE, VOUCHER_TYPE } from '@3un/utils'
import type { R } from '@3un/shared'
import type { HandleFeeType } from '../settings'

export interface RechargeApi {
  create(params: RechargeParams): R<any>
  check(): R<boolean>
  activity(): R<ActivityItem[]>
  payFee(): R<HandleFeeType>
}

export type RechargeMethod = 'wxpay' | 'alipay'

export interface RechargeParams {
  openId: string | null
  id: RECHARGE_TYPE
  type: RechargeMethod
  amount: number
}

export interface ActivityItem {
  id: number,
  name: string,
  description: string,
  startTime: string,
  endTime: string,
  rules: ActivityRuleItem[],
}

export interface ActivityRuleItem {
  minAmount: string,
  bonusAmount: string,
  creditsUsageType: VOUCHER_TYPE,
}
