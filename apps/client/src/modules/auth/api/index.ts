import type { AuthApi } from '../types'
import http from '@/utils/http'

const authApi: AuthApi = {
  sms: (phone) => http.get(`auth/sms/${phone}`),
  email: (email) => http.get(`auth/email/${email}`),

  getCaptcha: () => http.get('auth/captcha-refresh'),
  checkCaptcha: (params) => http.post('auth/captcha-check', params),
}

export default authApi
