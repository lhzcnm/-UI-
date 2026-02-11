import type { ServiceApi } from './types'
import http from '@/utils/http'

export * from './types'
export const serviceApi: ServiceApi = {
  list: (params) => http.get('service/list', { params }),
  item: (id) => http.get(`service/item/${id}`),
  header: (id) => http.get(`service/field/${id}`),
  setThread: (threadNumber) => http.post(`order/updateThreadNumber/${threadNumber}`),
  favorite: (id?) => http.get(`service/collection`,{ params: { serviceId: id } }),
  getTemplate: (id) => http.get(`service/get/${id}`)
}
