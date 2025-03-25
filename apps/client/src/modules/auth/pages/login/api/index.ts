import type { LoginApi } from '../types'
import http from '@/utils/http'

const loginApi: LoginApi = {
	getQrcode: () => http.get('auth/qrcode'),
	accountLogin: params => http.post('auth/login/account', params),
	phoneLogin: params => http.post('auth/login/phone', params),
	checkQrcode: (nonce) => http.post(`auth/qrcode/${nonce}`),
}

export default loginApi
