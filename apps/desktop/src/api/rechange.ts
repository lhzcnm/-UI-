import type { RechangeApiCollection } from '@3un/shared/rechange'
import http from '@/utils/http'

const rechangeApi: RechangeApiCollection = {
  list: params => http.get('recharge/list', { params }),
  export: () => http.post('recharge/export'),

  create: (params) => http.post('recharge/create', params),
  verify: () => http.get('recharge/check'),
}

export default rechangeApi
