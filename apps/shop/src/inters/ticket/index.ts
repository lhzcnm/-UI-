import { TICKET_PRIORITY } from "@3un/utils"
import { z } from "zod/v4"

export const zTicket = z.object({
  departmentId: z.number(),
  departmentName: z.string(),
  departmentNameEn: z.string().nullable(),
  departmentDes: z.string(),
  status: z.number(),
  deptOrder: z.number(),
})

export const zTicketForm = z.object({
  priority: z.enum(TICKET_PRIORITY),
  type: z.number(),
  subject: z.string(),
  msg: z.string(),
})

export type Ticket = z.infer<typeof zTicket>
export type TicketForm = z.infer<typeof zTicketForm>
