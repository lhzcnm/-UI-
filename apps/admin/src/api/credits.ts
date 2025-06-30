import type { CreditList, CreditListParams } from '@/inters/credits'

import http from "@/utils/http"

type CreditListFn = (params: CreditListParams) => Promise<CreditList>
export const getCreditList: CreditListFn = async (params) => {
  const { data } = await http.post('/credits/list', params)
  return data
}

type CreditCleanFn = (date: string) => Promise<void>
export const cleanCredit: CreditCleanFn = async (date) => {
  await http.get(`/credits/clean?time=${date}`)
}
