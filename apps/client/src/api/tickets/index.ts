import type { TicketApi } from './types'
import http from '@/utils/http'

export * from './types'

export const ticketApi: TicketApi = {
  list: () => http.get('ticket/list'),
  replys: (id) => http.get(`ticket/message/${id}`),
  create: (params) => http.post('ticket/create', params),
  reply: (params) => http.post('ticket/reply', params),
}
