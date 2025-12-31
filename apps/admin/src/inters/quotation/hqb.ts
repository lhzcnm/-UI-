import z from "zod/v4"
import { zBaseQuotation } from "."
import { zList } from "../common"

export const zHqb = zBaseQuotation.extend({
  statusDesc: z.string().default(''),
  colorDesc: z.string().default(''),
})

export const zHqbForm = zHqb.pick({
  model: true,
  memory: true,
  statusDesc: true,
  colorDesc: true,
  price: true,
})

export const zHqbUpdate = zHqbForm.extend({
  id: z.number(),
})

export const zHqbList = zList(zHqb)

export type Hqb = z.infer<typeof zHqb>
export type HqbCreateForm = z.infer<typeof zHqbForm>
export type HqbUpdateForm = z.infer<typeof zHqbUpdate>
export type HqbList = z.infer<typeof zHqbList>
