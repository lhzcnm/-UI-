import type { AuthApi } from '../types'
import http from '@/utils/http'

const authApi: AuthApi = {
  sms: (phone) => http.get(`auth/sms/${phone}`, { skipAuth: true }),
  email: (email) => http.get(`auth/email/${email}`, { skipAuth: true }),

  getCaptcha: () => http.get('auth/captcha-refresh', { skipAuth: true }),
  checkCaptcha: (params) => http.post('auth/captcha-check', params, { skipAuth: true }),

  getQrcode: () => http.get('auth/qrcode', { skipAuth: true }),
	accountLogin: params => http.post('auth/login/account', params, { skipAuth: true }),
	phoneLogin: params => http.post('auth/login/phone', params, { skipAuth: true }),
  mailLogin: params => http.post('auth/login/email', params, { skipAuth: true }),
	checkQrcode: (nonce) => http.post(`auth/qrcode/${nonce}`, null, { skipAuth: true }),
  
  forgotPsw: (params) => http.put('auth/forgot-psw', params, { skipAuth: true }),

  register: (params) => http.post('auth/register', params, { skipAuth: true }),
  register_sms: (phone) => http.get(`auth/register/sms/${phone}`, { skipAuth: true }),
  register_mail: (email) => http.get(`auth/register/email/${email}`, { skipAuth: true }),

  ticketAuth: (body) => http.post('auth/exchange', body, { skipAuth: true })
}

export default authApi
