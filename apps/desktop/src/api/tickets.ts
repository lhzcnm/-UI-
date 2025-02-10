import type { TicketApiCollection } from '@3un/shared/tickets'
import http from '@/utils/http'

const ticketApi: TicketApiCollection = {
  list: () => http.get('ticket/list'),
  create: (data) => http.post('ticket/create', data),

  replyList: (id) => http.get(`ticket/reply-list/${id}`),
  reply: (data) => http.post('ticket/reply-create', data),
}

export default ticketApi
