import type { OrderApi } from './types'
import http from '@/utils/http'

export * from './types'

export const orderApi: OrderApi = {
  item: (id) => http.get(`order/detail/${id}`),
  list: (parmas) => http.post(`order/list`, parmas),

  export: (parmas) => http.post(`order/export`, parmas),
  verify: (codeId) => http.get(`order/verify/${codeId}`),

  submit: (params) => http.post(`order/submit`, params),
  submitExport: (params) => http.post(`order/submit/export`, params),
  submitOrders: (data) => http.post('order/listOrder', data),
  orderPrint: (body) => http.post('order/print', body, { responseType: 'blob' }),

  cacheImei: (body) => http.post('order/cacheImei', body),
  deleteCacheImei: (body) => http.delete('order/deleteCacheImei', { params: body })
}
