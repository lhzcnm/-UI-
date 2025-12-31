import z from 'zod/v4'
import { zBaseQuotation } from '.'
import { zList } from '../common'

export const zHk = zBaseQuotation.extend({
  // deviceType: z.string().default(''),
  deviceTypeDesc: z.string().default(''),
  statusDesc: z.string().default(''),
  colorDesc: z.string().default(''),
})

export const zHkForm = zHk.pick({
  model: true,
  memory: true,
  statusDesc: true,
  colorDesc: true,
  price: true,
  deviceTypeDesc: true,
  brand: true,
})

export const zHkUpdate = zHkForm.extend({
  id: z.number(),
})

export const zHkList = zList(zHk)

export type Hk = z.infer<typeof zHk>
export type HkCreateForm = z.infer<typeof zHkForm>
export type HqbUpdateForm = z.infer<typeof zHkUpdate>
export type HkList = z.infer<typeof zHkList>
