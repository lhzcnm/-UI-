import type { TicketApiCollection } from '@3un/shared/tickets'
import http from '@/utils/http'

const ticketApi: TicketApiCollection = {
  list: () => http.get('ticket/new/list'),
  replys: ticketId => http.get(`ticket/message/${ticketId}`),
  create: params => http.post('ticket/new/create', params),
  reply: params => http.post('ticket/message', params),
}

export default ticketApi
