import type { R } from '@3un/shared'
import http from '@/utils/http'

interface ApiCollection {
  email: (email: string) => R<null>
  sms: (phone: string) => R<null>
}

const send: ApiCollection = {
  email: (email: string) => http.get(`send/email/${email}`),
  sms: (phone: string) => http.get(`send/sms/${phone}`),
}

export default send
