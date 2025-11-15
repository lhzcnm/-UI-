import z from "zod/v4"
import { zBaseQuotation } from "."
import { zList } from "../common"

export const zFeiyang = zBaseQuotation.extend({
  appearanceDesc: z.string().default(''),
})

export const zFeiyangForm = zFeiyang.pick({
  model: true,
  memory: true,
  appearanceDesc: true,
  price: true,
})

// export const zFeiyangSearch = zFeiyang.pick({
//   model: true
// }).partial()

export const zFeiyangUpdate = zFeiyangForm.extend({
  id: z.number(),
})
// export const zFeiyangUpdate = zFeiyangForm.extend({
//   id: z.number(),
// })

export const zFeiyangList = zList(zFeiyang)

export type Feiyang = z.infer<typeof zFeiyang>
export type FeiyangCreateForm = z.infer<typeof zFeiyangForm>
// export type FeiyangSearchForm = z.infer<typeof zFeiyangSearch>
export type FeiyangList = z.infer<typeof zFeiyangList>
export type FeiyangUpdateForm = z.infer<typeof zFeiyangUpdate>
