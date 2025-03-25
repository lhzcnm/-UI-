export enum RechargeType {
  ADMIN  = 1,
  WECHAT = 2,
  ALIPAY = 3,
}

export type Recharge = {
  id: number
  userId: number
  pricingId: number
  credits: number
  amount: number
  type: RechargeType
  isPaid: boolean
  isPricing: boolean
  billNum: string | null
  remark: string | null
  createdTime: string
  updatedTime: string
}
