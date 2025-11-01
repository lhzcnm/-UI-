import type { IList, IPage } from '@3un/shared'
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

export type Quotation = z.infer<typeof zQuotation>
export type QuotationFormSearch = z.infer<typeof zQuotationFormSearch>
export type QuotationList = IList<Quotation>

export interface QuotationListParams extends IPage, QuotationFormSearch {}
