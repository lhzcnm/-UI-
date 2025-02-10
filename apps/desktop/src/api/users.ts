import type { UserApiCollection } from '@3un/shared/users'
import http from '@/utils/http'

const userApi: UserApiCollection = {
  info: () => http.get('user/info'),
  credit: () => http.get('user/credits'),
  servicePrices: () => http.get('user/only/prices'),

  updateInfo: (params) => http.put('user/info', params),
  verifyPhone: (params) => http.put('user/verify/phone', params),
  verifyEmail: (params) => http.put('user/verify/email', params),

  apiKey: () => http.get('user/api/key'),
  bindWechat: () => http.get('wx/bind/qrcode'),

  loginLogs: () => http.get('user/login-log'),
  creditLogs: (params) => http.get('user/credit-history', { params }),
}

export default userApi
