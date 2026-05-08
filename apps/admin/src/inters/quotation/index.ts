import z from "zod/v4"
import { zPage } from "../common"
import { QUOTATION_ENUM } from "@/utils/enum"

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
