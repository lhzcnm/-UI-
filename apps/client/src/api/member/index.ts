import type { MemberApi } from './types'
import http from '@/utils/http'

export * from './types'

export const memberApi: MemberApi = {
  memberList: (config) => http.get('member/list', config),
  memberPkg: (id) => http.get(`member/pkg/${id}`),
}
