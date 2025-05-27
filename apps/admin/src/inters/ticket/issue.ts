import type { WithId } from '@3un/shared'
import * as z from 'zod'

export const zTicketIssue = z.interface({
  departmentId: z.number().default(0),
  departmentName: z.string().default(''),
  departmentDes: z.string().default(''),
  // addedOn: z.string().default(''),
  // status: z.number().default(0),
  enable: z.number().default(1),
  deptOrder: z.number().default(1),
  // deptEmail: z.string().default(''),
})

export type TicketIssue = z.infer<typeof zTicketIssue>

// Form
export const zTicketIssueForm = zTicketIssue.omit({ departmentId: true })

// Create & Update
export type TicketIssueCreateParams = z.infer<typeof zTicketIssueForm>
export type TicketIssueUpdateParams = WithId<TicketIssueCreateParams, 'departmentId'>
