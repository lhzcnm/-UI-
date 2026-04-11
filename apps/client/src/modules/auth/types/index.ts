import type { XCaptcha, XCaptchaCheckParams } from '@3un/ui'
import type { R } from '@3un/shared'

export interface AuthApi {
  sms: (phone: string) => R<null>
  email: (email: string) => R<null>

  getCaptcha: () => R<XCaptcha>
  checkCaptcha: (params: XCaptchaCheckParams) => R<string>

  getQrcode: () => R<QrcodeResponse>
  accountLogin: (params: AccountLoginParams) => R<string>
  phoneLogin: (params: PhoneLoginParams) => R<string>
  mailLogin: (params: MailLoginParams) => R<string>
  checkQrcode: (nonce: string) => R<string>

  forgotPsw: (params: ForgotPswParams) => R<string>

  register: (params: RegisterRequest) => R<string>
  register_sms: (phone: string) => R<string>
  register_mail: (email: string) => R<string>

  ticketAuth: (body: TicketAuth) => R<string>
}

export type LoginMode = 'account' | 'phone' | 'wechat' | 'mail'

// Account
export interface AccountLoginParams {
  id: string
  username: string
  password: string
}
export interface AccountLoginForm {
  username: string
  password: string
}

// Phone
export interface PhoneLoginParams {
  id: string
  phone: string
  code: string
}
export interface PhoneLoginForm {
  phone: string
  code: string
}

// mail
export interface MailLoginParams {
  id: string,
  email: string,
  code: string,
}
export interface MailLoginForm {
  email: string,
  code: string,
}

// Qrcode
export interface QrcodeResponse {
  qrcodeUrl: string
  nonce: string
}

// Forgot
export type ForgotPswParams = {
  target: string
  code: string
  password: string
}
export type ForgotPswForm = {
  target: string
  code: string
  password: string
  confirmPassword: string
}

// register
export interface RegisterForm {
  code: string,
  email: string | undefined,
  phone: string | undefined,
}

export interface RegisterRequest extends RegisterForm {
  id: string,
}

export interface TicketAuth {
  code: string,
}
