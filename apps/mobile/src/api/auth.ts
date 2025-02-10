import type { AuthApiCollection } from '@3un/shared/auth'
import http from '@/utils/http'

const authApi: AuthApiCollection = {
  register: (params) => http.post('auth/register', params),

  accountLogin: (params) => http.post('auth/login/account', params),
  phoneLogin: (params) => http.post('auth/login/phone', params),
  logout: () => http.post('auth/logout'),

  getQrcode: () => http.get('auth/qrcode'),
  checkQrcode: (nonce) => http.post(`auth/qrcode/${nonce}`),

  getCaptcha: () => http.get('auth/captcha/refresh'),
  checkCaptcha: (params) => http.post('auth/captcha/check', params),

  sendSMS: (phone) => http.get(`auth/send?phone=${phone}`),
  sendEmail: (email) => http.get(`auth/send?email=${email}`),
}

export default authApi
