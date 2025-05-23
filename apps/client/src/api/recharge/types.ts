import type { RECHARGE_TYPE } from '@3un/utils'
import type { R } from '@3un/shared'

export interface RechargeApi {
  create(params: RechargeParams): R<any>
  check(): R<boolean>
}

export type RechargeMethod = 'wxpay' | 'alipay'

export interface RechargeParams {
  openId: string | null
  id: RECHARGE_TYPE
  type: RechargeMethod
  amount: number
}
