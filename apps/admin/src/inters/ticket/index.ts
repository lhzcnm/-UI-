import { TICKET_PRIORITY, TICKET_STATUS } from '@3un/utils'
import type { IList, IPage } from '@3un/shared'
import { z } from 'zod/v4'

export * from './issue'

export const zTicket = z.object({
  id: z.number().default(0),
  userId: z.number().default(0),
  subject: z.string().default(''),
  type: z.number().default(0),
  time: z.string().default(''),
  userName: z.string().default(''),
  headImgUrl: z.string().nullable(),
  priority: z.enum(TICKET_PRIORITY).default(TICKET_PRIORITY.LOW),
  statusId: z.enum(TICKET_STATUS).default(TICKET_STATUS.WAIT),
})

export type Ticket = z.infer<typeof zTicket>

// Search
export type TicketSearch = {
  status: number | undefined
  priority: number | undefined
  type: number | undefined
}

// List
export type TicketList = IList<Ticket>
export interface TicketListParams extends IPage, TicketSearch {}

// Update
export type TicketUpdateParams = {
  id: number
  subject?: string
  priority?: TICKET_PRIORITY
  statusId?: TICKET_STATUS
  type?: number
}

// Reply
export const zTicketReply = z.object({
  id: z.number().default(0),
  ticketId: z.number().default(0),
  replyId: z.number().nullable(),
  msg: z.string().default(''),
  time: z.string().default(''),
})

export type TicketReply = z.infer<typeof zTicketReply>

// Create
export type TicketReplyCreateParams = {
  ticketId: number
  msg: string
}
