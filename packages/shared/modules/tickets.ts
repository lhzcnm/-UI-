import type { TICKET_STATUS, TICKET_PRIORITY, TICKET_TYPE } from '@3un/utils'
import type { R } from '..'

export interface TicketApiCollection {
  list: () => R<TicketItem[]>
  create: (params: TicketCreateParams) => R<TicketItem>

  replyList: (id: number) => R<TicketReplyItem[]>
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

// ----------
// Reply
// ----------
export interface TicketReplyItem {
  id: number
  ticketId: number
  replyId: number
  msg: string
  time: string
}

export interface TicketReplyParams {
  ticketId: number
  msg: string
}
