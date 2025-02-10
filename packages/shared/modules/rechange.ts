import type { R, IList, IPage } from '..'

export interface RechangeApiCollection {
  list: (params: IPage) => R<IList<RechangeItem>>
  export: () => R<string>

  create: (params: RechangeParams) => R<any>
  verify: () => R<boolean>
}

export enum RechangeType {
  ADMIN  = 1,
  WECHAT = 2,
  ALIPAY = 3,
}

// Rechange
export interface RechangeItem {
  id: number
  userId: number
  pricingId: number
  credits: number
  amount: number
  type: RechangeType
  isPaid: boolean
  isPricing: boolean
  billNum: string
  createdTime: string
  updatedTime: string
}

// export type RechangeType = 'wxpay' | 'alipay'
export interface RechangeParams {
  id: 1 | 2
  amount: number
  openId?: string
  type: RechangeType
}
export type WXRechange =
  { h5_url?: string, code_url?: string } &
  {
    appId: string
    timeStamp: string
    nonceStr: string
    package: string
    signType: 'RSA'
    paySign: string
  }
