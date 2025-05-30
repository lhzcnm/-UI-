import type { TicketTypeCreateParams, TicketList, TicketReply, TicketSearch, TicketType } from '@/inters/ticket'
import type { IK } from '@3un/shared'

export interface TicketStore {
  tickets: TicketList
  replies: TicketReply[]
  types: TicketType[]

  index: number | undefined
  formSearch: TicketSearch
  formType: TicketTypeCreateParams
  visibleSearch: boolean
  visibleType: boolean

  page: number
  limit: number
  refresh: boolean
}

export const TICKET_STORE: IK<TicketStore> = Symbol('ticket')
