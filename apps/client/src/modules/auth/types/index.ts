import type { Captcha, CaptchaCheckParams } from '@3un/ui'
import type { R } from '@3un/shared'

export interface AuthApi {
  sms: (phone: string) => R<null>
  email: (email: string) => R<null>

  getCaptcha: () => R<Captcha>
  checkCaptcha: (params: CaptchaCheckParams) => R<string>
}
