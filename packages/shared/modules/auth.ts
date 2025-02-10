import type { Captcha, CaptchaCheckParams } from '@3un/ui'
import type { R } from '..'

export type AuthApiCollection = {
  logout(): R<null>
  register(params: RegisterParams): R<string>

  accountLogin(params: AccountLoginParams): R<string>
  phoneLogin(params: PhoneLoginParams): R<string>

  getQrcode(): R<QrcodeResponse>
  checkQrcode(nonce: string): R<string>

  getCaptcha(): R<Captcha>
  checkCaptcha(params: CaptchaCheckParams): R<string>

  sendSMS(phone: string): R<null>
  sendEmail(email: string): R<null>

  resetPassword(params: ResetPasswordParams): R<null>
}

// ---------
// Qrcode
// ---------
export type QrcodeResponse = {
  qrcodeUrl: string
  nonce: string
}

// ---------
// Login
// ---------
export type AccountLoginParams = {
  id: string
  username: string
  password: string
}
export type AccountLoginForm = {
  username: string
  password: string
}

export type PhoneLoginParams = {
  id: string
  phone: string
  code: string
}
export type PhoneLoginForm = {
  phone: string
  code: string
}

// ---------
// Register
// ---------
export type RegisterParams = {
  id: string
  phone: string
  code: string
  password: string
  inviteCode?: string
}
export type RegisterForm = {
  phone: string
  code: string
  password: string
  confirmPassword: string
  inviteCode: string
}

// ---------
// Reset Password
// ---------
export type ResetPasswordParams = {
  target: string
  code: string
  password: string
}
export type ResetPasswordForm = {
  target: string
  code: string
  password: string
  confirmPassword: string
}
