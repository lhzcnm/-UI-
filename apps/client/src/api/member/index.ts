import type { MemberApi } from './types'
import http from '@/utils/http'

export * from './types'

export const memberApi: MemberApi = {
  memberList: () => http.get('member/list'),
  memberPkg: (id) => http.get(`member/pkg/${id}`),
}
