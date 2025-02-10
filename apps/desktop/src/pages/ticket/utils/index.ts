import type { TicketCreateForm, TicketItem, TicketReplyItem } from '@3un/shared/tickets'
import type { InjectionKey } from 'vue'

import { TICKET_PRIORITY, TICKET_TYPE } from '@3un/utils'

export interface TicketStore {
  tickets: TicketItem[]
  replies: TicketReplyItem[]
  createForm: TicketCreateForm
  visibleCreate: boolean
  index: number | undefined
}

type TicketStoreKey = InjectionKey<TicketStore>
export const TICKET_STORE = Symbol('ticket-store') as TicketStoreKey

interface Form {
  create: TicketCreateForm
}

export const form: Form = {
  create: {
    priority: TICKET_PRIORITY.MEDIUM,
    type: TICKET_TYPE.ORDER,
    subject: '',
    msg: '',
  },
}
