import type { QUOTATION_TYPE } from '@3un/utils'

import { zQuotation, type QuotationCreateParams, type QuotationList, type QuotationListParams, type QuotationUpdateParams } from '@/inters/quotation'
import http from '@/utils/http'

export async function getOldQuotations(category: QUOTATION_TYPE, params: QuotationListParams): Promise<QuotationList> {
  const { data } = await http.get<QuotationList>(`quotation/list/${category}`, { params })
  return { ...data, list: data.list.map((item) => zQuotation.parse(item)) }
}

export async function createOldQuotations(body: QuotationCreateParams): Promise<void> {
  await http.post<void>('/quotation/add', body)
}

export async function updateOldQuotations(body: QuotationUpdateParams): Promise<void> {
  await http.put<void>('/quotation/update', body)
}

export async function deleteOldQuotations(data: number[]): Promise<void> {
  await http.delete('/quotation/delete', { data })
}
