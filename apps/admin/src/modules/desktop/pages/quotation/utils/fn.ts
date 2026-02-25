import { type QUOTATION_MAP } from "@/utils/quotation"
import { QUOTATION_MAP_ITEM, type QuotationListResult } from "."

export async function getQuotationList<T extends QUOTATION_MAP> (
  type: T,
  params: any,
): Promise<QuotationListResult<T>> {
  const api = QUOTATION_MAP_ITEM[type].get

  const raw = await api(params)
  return raw
}

export async function createQuotation<T extends QUOTATION_MAP> (
  type: T,
  params: any,
): Promise<null> {
  const api = QUOTATION_MAP_ITEM[type].create

  const res = await api(params)
  return res
}

export async function updateQuotation<T extends QUOTATION_MAP> (
  type: T,
  params: any,
): Promise<null> {
  const api = QUOTATION_MAP_ITEM[type].update

  const res = await api(params)
  return res
}

export async function deleteQuotation<T extends QUOTATION_MAP> (
  type: T,
  params: number[],
): Promise<null> {
  const api = QUOTATION_MAP_ITEM[type].delete

  const res = await api(params)
  return res
}
