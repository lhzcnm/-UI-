import type { OrderApiCollection } from '@3un/shared/orders'
import http from '@/utils/http'

const orderApi: OrderApiCollection = {
  item: (id) => http.get(`order/detail/${id}`),
  list: (data) => http.post('order/list', data),

  export: (data) => http.post('order/export', data),
  feedback: (id) => http.get(`order/feedback/${id}`),

  submit: (data) => http.post('order/submit', data),
  submitExport: (data) => http.post('order/submitExport', data),
}

export default orderApi
