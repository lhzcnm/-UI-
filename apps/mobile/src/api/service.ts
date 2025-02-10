import type { ServiceApiCollection } from '@3un/shared/services'
import http from '@/utils/http'

const serviceApi: ServiceApiCollection = {
  list: () => http.get('service/list'),
  item: (id) => http.get(`service/${id}`),
  header: (id) => http.get(`service/item/${id}`),
}

export default serviceApi
