import type { R } from '..'

export interface SettingApiCollection {
  get: () => R<Setting>
}

export interface Setting {
  title: string
  company: string
  phone: string
  email: string
  address: string
  beian: string

  enwsInfo: string
  noticeInfo: string
  paymentInfo: string

  maxRechargeAmount: number
  minRechargeAmount: number

  enableNews: boolean
  enableNotice: boolean
  enablePayment: boolean

  enableRegister: boolean
  enableTricket: boolean
  enableOrderVerify: boolean
}
