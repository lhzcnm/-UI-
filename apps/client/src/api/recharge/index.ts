import type { RechargeApi } from './types'
import http from '@/utils/http'

export * from './types'

export const rechargeApi: RechargeApi = {
  create: (params) => http.post('pay', params),
  check: () => http.get('pay/check'),
  activity: () => http.get('activity/current'),
}
