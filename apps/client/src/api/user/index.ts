import type { UserApi } from './types'
import http from '@/utils/http'

export * from './types'

export const userApi: UserApi = {
  info: () => http.get('user/info'),
  credit: () => http.get('user/credits'),
  servicePrices: () => http.get('user/only/prices'),

  apiKey: () => http.get('user/api/key'),
  bindWechat: () => http.get('wx/bind/qrcode'),

  updateInfo: (params) => http.put('user/info', params),
  updatePassword: (params) => http.put('user/forgot-psw', params),
  updatePhone: (params) => http.put('user/phone', params),
  updateEmail: (params) => http.put('user/email', params),

  invoices: (params) => http.get(`user/invoices`, { params }),
  exportInvoices: () => http.get('user/invoices/export'),

  creditLogs: (params) => http.get('user/credit-logs', { params }),
  loginLogs: () => http.get('user/login-logs'),

  logout: () => http.post('user/logout'),
}
