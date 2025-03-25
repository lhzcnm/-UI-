import type { ServiceApi } from './types'
import http from '@/utils/http'

export * from './types'
export const serviceApi: ServiceApi = {
  list: () => http.get('service/list'),
  item: (id) => http.get(`service/item/${id}`),
  header: (id) => http.get(`service/field/${id}`),
}
