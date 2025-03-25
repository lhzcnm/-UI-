import type { R } from '@3un/shared'

export interface NoticeApi {
  email(email: string): R<null>
  sms(phone: string): R<null>
}
