import { QUOTATION_MAP_ITEM, type QuotationListResult, type QuotationMap } from "."

export async function getQuotationList<T extends QuotationMap>(
  type: T,
  params: any,
): Promise<QuotationListResult<T>> {
  const api = QUOTATION_MAP_ITEM[type].get

  const raw = await api(params)
  return raw
}


