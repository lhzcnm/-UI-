import type { QUOTATION_TYPE } from '@3un/utils'

import { zQuotation, type QuotationList, type QuotationListParams } from '@/inters/quotation'
import http from '@/utils/http'

export async function getOldQuotations(category: QUOTATION_TYPE, params: QuotationListParams): Promise<QuotationList> {
  const { data } = await http.get<QuotationList>(`quotation/list/${category}`, { params })
  return { ...data, list: data.list.map((item) => zQuotation.parse(item)) }
}
