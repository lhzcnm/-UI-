import type { TICKET_STATUS, TICKET_PRIORITY, TICKET_TYPE } from '@3un/utils'
import type { R } from '@3un/shared'

export interface TicketApi {
  list: () => R<TicketItem[]>
  replys: (ticketId: number) => R<TicketReplyItem[]>
  create: (params: TicketCreateParams) => R<TicketItem>
  reply: (params: TicketReplyParams) => R<TicketReplyItem>
}

export interface TicketItem {
  id: number
  priority: TICKET_PRIORITY
  type: TICKET_TYPE
  statusId: TICKET_STATUS
  subject: string
  time: string
  userId: number
}

// ----------
// Create
// ----------
export interface TicketCreateParams {
  priority: TICKET_PRIORITY
  type: TICKET_TYPE
  subject: string
  msg: string
}
export interface TicketCreateForm {
  priority: TICKET_PRIORITY
  type: TICKET_TYPE
  subject: string
  msg: string
}

// ---------
// Ticket Reply
// ---------
export interface TicketReplyParams {
  ticketId: number
  msg: string
}
export interface TicketReplyItem {
  id: number
  ticketId: number
  replyId: number | null
  msg: string
  time: string
}
