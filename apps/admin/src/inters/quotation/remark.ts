import z from 'zod/v4'
import type { IList } from '../common'
import type { IPage, WithId } from '@3un/shared'

export const zRemark = z.object({
  id: z.number(),
  brand: z.number().default(0),
  model: z.string().default(''),
  remark: z.string().nullable().default(''),
  priceType: z.number().default(0),
  remarkLocal: z.string().nullable().default(''),
  updateTime: z.string(),
})

export const zRemarkSearch = zRemark.pick({
  brand: true,
  priceType: true,
  model: true,
}).partial()

export const zRemarkForm = zRemark.pick({
  brand: true,
  model: true,
  priceType: true,
  remark: true,
  remarkLocal: true,
})

export type Remark = z.infer<typeof zRemark>
export type RemarkSearch = z.infer<typeof zRemarkSearch>
export type RemarkCreate = z.infer<typeof zRemarkForm>

export type RemarkList = IList<Remark>
export type RemarkSearchForm = IPage & RemarkSearch
export type RemarkUpdate = WithId<RemarkCreate, 'id'>
