import type { LoginApi } from './types'
import http from '@/utils/http'

const authApi: LoginApi = {
  login: (data) => http.post('auth/login', data),
  getLoginQrcode: () => http.get('auth/qrcode'),
  verifyLoginQrcode: (nonce) => http.post(`auth/qrcode/${nonce}`),
}

export * from './types'
export default authApi
