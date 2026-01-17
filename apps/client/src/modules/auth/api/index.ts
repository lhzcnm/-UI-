import type { AuthApi } from '../types'
import http from '@/utils/http'

const authApi: AuthApi = {
  sms: (phone) => http.get(`auth/sms/${phone}`),
  email: (email) => http.get(`auth/email/${email}`),

  getCaptcha: () => http.get('auth/captcha-refresh'),
  checkCaptcha: (params) => http.post('auth/captcha-check', params),

  getQrcode: () => http.get('auth/qrcode'),
	accountLogin: params => http.post('auth/login/account', params),
	phoneLogin: params => http.post('auth/login/phone', params),
  mailLogin: params => http.post('auth/login/email', params),
	checkQrcode: (nonce) => http.post(`auth/qrcode/${nonce}`),
  
  forgotPsw: (params) => http.put('auth/forgot-psw', params),

  register: (params) => http.post('auth/register', params),
  register_sms: (phone) => http.get(`auth/register/sms/${phone}`),
  register_mail: (email) => http.get(`auth/register/email/${email}`),
}

export default authApi
