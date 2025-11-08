import type { IList, IPage, WithId } from '@3un/shared'
import { QUOTATION_TYPE } from '@3un/utils'
import { z } from 'zod/v4'

export const zQuotation = z.object({
  id: z.number(),
  model: z.string(),
  big: z.string(),
  quoteCategory: z.number(),
  status: z.string(),
  statusLocal: z.string(),
  basePrice: z.number(),
  modelCategory: z.string(),
  modelId: z.number(),
  updateTime: z.string(),
})

export const zQuotationFormSearch = z.object({
  model: z.string().optional(),
  modelId: z.string().optional(),
})

export const zQuotationForm = zQuotation.omit({
  id: true,
  quoteCategory: true,
  modelCategory: true,
  modelId: true,
  updateTime: true,
}).extend({
  quoteCategory: z.enum(QUOTATION_TYPE),
})

export const zQuotationDelete = z.object({
  ids: z.array(z.number())
})

export type Quotation = z.infer<typeof zQuotation>
export type QuotationFormSearch = z.infer<typeof zQuotationFormSearch>
export type QuotationCreateParams = z.infer<typeof zQuotationForm>
export type QuotationDeleteParams = z.infer<typeof zQuotationDelete>

export type QuotationList = IList<Quotation>
export type QuotationUpdateParams = WithId<QuotationCreateParams, 'id'> 


export interface QuotationListParams extends IPage, QuotationFormSearch {}
