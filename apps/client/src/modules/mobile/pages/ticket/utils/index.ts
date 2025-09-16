import type { TicketCreateForm, TicketItem, TicketReplyItem, TicketOption } from '@/api/tickets'
import type { InjectionKey } from 'vue'

import { TICKET_PRIORITY, TICKET_TYPE } from '@3un/utils'

export interface TicketStore {
  tickets: TicketItem[]
  replies: TicketReplyItem[]
  types: TicketOption[]
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

export function getAvatar(replyId: number | null, avatar: string) {
  const mode = import.meta.env.VITE_APP_MODE
  if (replyId) return '/images/customer_service_avatar.png'
  return avatar || `/${mode}/default_avatar.jpg`
}
