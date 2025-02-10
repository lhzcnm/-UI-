import type { R, IList, IPage } from '..'

export type UserApiCollection = {
  info(): R<UserInfo>
  credit(): R<string>
  servicePrices(): R<UserServicePrice[]>

  updateInfo(params: UserUpdateParams): R<null>
  verifyPhone(params: VerifyPhoneParams): R<null>
  verifyEmail(params: VerifyEmailParams): R<null>

  loginLogs(): R<LoginLogItem[]>
  creditLogs(params: IPage): R<CreditLogResponse>

  apiKey(): R<string>
  bindWechat(): R<string>
}

export type UserInfo = {
  id: number
  username: string
  account: string
  email: string | null
  phone: string | null
  avatar: string | null
  openId: string
  credits: number
  level: string
  memberExp: string
  usageDays: number
  bulkApi: string

  rechargeCount: number
  totalReceipts: number
  totalUnpaidReceipts: number
  userOrder: UserOrderInfo
}
export type UserOrderInfo = {
  total: number
  failed: number
  success: number
}

// User Service Price
export type UserServicePrice = {
  serviceId: number
  price: number
}

// ---------
// Update User Info
// ---------
export type UserUpdateParams = {
  phone?: string
  email?: string
  inviteCode?: string
}
export type VerifyPhoneParams = {
  phone: string
  code: string
}
export type VerifyEmailParams = {
  email: string
  code: string
}

// ---------
// User Login Log
// ---------
export type LoginLogItem = {
  ip: string
  region: string
  loginTime: string
  logoutTime: string
}

// ---------
// User Credit Change Log
// ---------
export type CreditLogItem = {
  orderId: number
  credits: number
  remainingCredits: number
  description: string
  createdTime: string
  updatedTime: string
  remark: string
  ip: string
}

export type CreditLogResponse = IList<CreditLogItem>
