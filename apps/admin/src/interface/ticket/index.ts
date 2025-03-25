export enum TicketPriority {
  HIGH   = 1,
  NORMAL = 2,
  LOW    = 3,
}

export enum TicketStatus {
  UNRESOLVED = 1,
  PROCESSING = 2,
  RESOLVED   = 3,
}

export type Ticket = {
  id: number
  userId: number
  issueId: number
  priority: TicketPriority
  status: TicketStatus
  subject: string
  createdTime: string
  updatedTime: string
}
