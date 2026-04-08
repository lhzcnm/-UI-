import type { PROFILE_TYPE } from '@/modules/desktop/pages/profile/types'
import type { R, IList, IPage } from '@3un/shared'
import type { ACCESS_LEVEL } from '@3un/utils'

export interface UserApi {
  info(): R<UserInfo>
  credit(): R<string>
  servicePrices(): R<UserServicePrice[]>

  apiKey(): R<string>
  apiBulkKey(): R<string>

  bindWechat(): R<string>
  checkWechat(userId: number, signal?: AbortSignal): R<string>

  updateInfo(params: UserUpdateNameParams): R<void>
  updatePassword(params: UserUpdatePassParams): R<void>
  updatePhone(params: UpdatePhoneParams): R<void>
  updateEmail(params: UpdateEmailParams): R<void>

  invoices(params: IPage): R<InvoicesResponse>
  exportInvoices(): R<string>

  creditLogs(params: IPage): R<CreditLogsResponse>
  loginLogs(): R<LoginLogItem[]>

  logout(): R<void>

  unbindApply(params: UnBindApplyParams): R<void>
  unbindConfirm(params: UnBindConfirmParams): R<void>

  // heartBeat(): R<void>
}

export interface UserInfo {
  userId: number
  username: string
  nickname: string
  email: string
  phone: string
  avatar: string
  openId: string
  credits: string
  address: string
  pricePlan: string
  pricePlanId: number
  memberExp: string
  usageDays: number
  enableDevice: boolean
  apiKey: string
  allowApi: boolean
  bulkCheckApi: string
  rechargeCount: string
  totalReceipts: string
  totalUnpaidReceipts: string
  accessLevel: ACCESS_LEVEL
  userOrder: {
    failed: number
    success: number
    total: number
  }
}

/** User Service Price */
export interface UserServicePrice {
  id: number
  packageId: number
  price: number
  updateAt: string
  updateBy: string
}

/** Update User Info */
export interface UserUpdateNameParams {
  name: string
}
export interface UserUpdatePassParams {
  target: string
  code: string
  password: string
}
export interface UpdatePhoneParams {
  phone: string
  code: string
}
export interface UpdateEmailParams {
  email: string
  code: string
}

/** Invoices */
export type InvoicesResponse = IList<InvoiceItem>

export interface InvoiceItem {
  paymentId: number
  invoiceTime: string
  amount: string
  credits: string
  paymentStatusId: number
  paymentStatus: string
  paymentMethod: string
  // currency: string
}

/** Login Log */
export interface LoginLogItem {
  ip: string
  region: string
  loginTime: string
  logoutTime: string
}

/** Credit Change Log */
export type CreditLogsResponse = IList<CreditLogItem>

export interface CreditLogItem {
  historyId: number
  packageId: number
  packageTitle: string | null
  userId: number
  imeiNo: string
  credits: number
  creditsLeft: string
  historyDtTm: string
  description: string
  ip: string | null
  comments: string
}

export interface UnBindApplyParams {
  target: string,
  type: PROFILE_TYPE,
}

export interface UnBindConfirmParams {
  target: string,
  type: PROFILE_TYPE,
  code: string,
}
