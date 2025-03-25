import type { R } from '@3un/shared'

export interface ForgotApi {
  forgotPsw: (params: ForgotPswParams) => R<string>
}

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
