import type { TicketTypeCreateParams, TicketList, TicketReply, TicketSearch, TicketType } from '@/inters/ticket'
import type { IK } from '@3un/shared'

export interface TicketStore {
  tickets: TicketList
  replies: TicketReply[]
  types: TicketType[]

  formSearch: TicketSearch
  formType: TicketTypeCreateParams
  
  visibleSearch: boolean
  visibleType: boolean
  visibleReply: boolean
  
  refresh: boolean
  index  : number | undefined
  page   : number
  limit  : number
}

export const TICKET_STORE: IK<TicketStore> = Symbol('ticket')
