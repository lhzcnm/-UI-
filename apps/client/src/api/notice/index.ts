import type { NoticeApi } from './types'
import http from '@/utils/http'

export * from './types'

export const noticeApi: NoticeApi = {
  email: (email) => http.get(`send/email/${email}`),
  sms: (phone) => http.get(`send/sms/${phone}`),
}
