export type TicketReply = {
  id: number
  ticketId: number
  replyId: number | null
  message: string
  createdTime: string
  updatedTime: string
}
