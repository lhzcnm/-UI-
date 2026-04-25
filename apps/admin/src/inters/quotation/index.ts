import { BRAND_STATUS } from "@3un/utils"
import z from "zod/v4"
import { zPage } from "../common"
import { QUOTATION_ENUM } from "@/utils/enum"

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

export const zApiEnum = z.object({
  code: z.number(),
  descEn: z.string(),
  descCn: z.string(),
})

export const zQuotationUploadForm = z.object({
  file: z.file().optional(),
  key: z.enum(QUOTATION_ENUM).default(QUOTATION_ENUM.OLD),
})

export type QuotationSearchForm = z.infer<typeof zQuotationSearch>
export type ApiEnum = z.infer<typeof zApiEnum>
export type QuotationUpload = z.infer<typeof zQuotationUploadForm>
