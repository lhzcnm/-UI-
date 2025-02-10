import type { R } from '@3un/shared'
import http from '@/utils/http'

interface NoticeApiCollection {
  sms: (phone: string) => R<null>
  email: (email: string) => R<null>
}

const noticeApi: NoticeApiCollection = {
  sms: (phone: string) => http.get(`notice/sms/${phone}`),
  email: (email: string) => http.get(`notice/email/${email}`),
}

export default noticeApi
