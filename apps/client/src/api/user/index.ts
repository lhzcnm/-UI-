import type { UserApi } from './types'
import http from '@/utils/http'

export * from './types'

export const userApi: UserApi = {
  info: () => http.get('user/info'),
  credit: () => http.get('user/credits'),
  servicePrices: () => http.get('user/only/prices'),

  apiBulkKey: () => http.get('user/bulk-key'),
  apiKey: () => http.get('user/api-key'),

  bindWechat: () => http.get('wx/bind/qrcode'),
  checkWechat: (userId, signal?) => http.post(`wx/bind/${userId}`, null, { signal: signal }),

  updateInfo: (params) => http.put('user/info', params),
  updatePassword: (params) => http.put('user/forgot-psw', params),
  updatePhone: (params) => http.put('user/phone', params),
  updateEmail: (params) => http.put('user/email', params),

  invoices: (params) => http.get(`user/invoices`, { params }),
  exportInvoices: () => http.get('user/invoices/export'),

  creditLogs: (params) => http.get('user/credit-logs', { params }),
  loginLogs: () => http.get('user/login-logs'),

  logout: () => http.post('user/logout'),

  unbindApply: (params) => http.post("/user/unbind/apply", params),
  unbindConfirm: (params) => http.post("/user/unbind/confirm", params),

  // heartBeat: () => http.get('user/heartbeat'),
}
