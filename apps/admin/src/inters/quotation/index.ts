import { BRAND_STATUS } from "@3un/utils"
import z from "zod/v4"
import { zPage } from "../common"

export const zBaseQuotation = z.object({
  id: z.number(),
  brand: z.enum(BRAND_STATUS).default(BRAND_STATUS.IPHONE),
  model: z.string().default(''),
  memory: z.string().default(''),
  price: z.number().default(0),
  updateTime: z.string(),
  remarkId: z.number(),
})

export const zQuotationSearch = zPage.extend({
  model: z.string().optional(),
})

export type QuotationSearchForm = z.infer<typeof zQuotationSearch>
