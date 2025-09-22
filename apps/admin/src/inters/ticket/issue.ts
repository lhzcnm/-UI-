import type { WithId } from '@3un/shared'
import { z } from 'zod/v4'

export const zTicketType = z.object({
  departmentId: z.number().default(0),
  departmentName: z.string().default(''),
  departmentNameEn: z.string().default('').nullable(),
  departmentDes: z.string().default(''),
  // addedOn: z.string().default(''),
  status: z.number().default(0),
  // enable: z.number().default(1),
  deptOrder: z.number().default(1),
  // deptEmail: z.string().default(''),
})

export type TicketType = z.infer<typeof zTicketType>

// Form
export const zTicketTypeForm = zTicketType.omit({ departmentId: true })

// Create & Update
export type TicketTypeCreateParams = z.infer<typeof zTicketTypeForm>
export type TicketTypeUpdateParams = WithId<TicketTypeCreateParams, 'departmentId'>
