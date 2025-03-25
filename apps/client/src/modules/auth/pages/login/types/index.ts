import type { R } from '@3un/shared'

export interface LoginApi {
  getQrcode: () => R<QrcodeResponse>
  accountLogin: (params: AccountLoginParams) => R<string>
  phoneLogin: (params: PhoneLoginParams) => R<string>
  checkQrcode: (nonce: string) => R<string>
}

export type LoginMode = 'account' | 'phone' | 'wechat'

/** Account */
export interface AccountLoginParams {
  id: string
  username: string
  password: string
}
export interface AccountLoginForm {
  username: string
  password: string
}

/** Phone */
export interface PhoneLoginParams {
  id: string
  phone: string
  code: string
}
export interface PhoneLoginForm {
  phone: string
  code: string
}

/** Qrcode */
export interface QrcodeResponse {
  qrcodeUrl: string
  nonce: string
}
