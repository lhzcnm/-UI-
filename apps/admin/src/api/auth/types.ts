import type { R } from '@3un/shared'

export interface LoginApi {
  login: (data: LoginParams) => R<string>
  getLoginQrcode: () => R<LoginQrcodeResponse>
  verifyLoginQrcode: (nonce: string) => R<string>
}

export interface LoginParams {
  username: string
  password: string
}
export interface LoginForm {
  username: string
  password: string
}

// Wechat Login Qrcode
export interface LoginQrcodeResponse {
  nonce: string
  qrcodeUrl: string
}
