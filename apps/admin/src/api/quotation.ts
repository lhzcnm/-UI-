import type { IPage } from "@3un/shared"

import { zFeiyangList, type FeiyangCreateForm, type FeiyangList, type FeiyangUpdateForm } from "@/inters/quotation/feiyang"
import http from "@/utils/http"
import type { QuotationSearchForm } from "@/inters/quotation"
import { zHqbList, type HqbCreateForm, type HqbList, type HqbUpdateForm } from "@/inters/quotation/hqb"

// feiyang quotation
type GetFeiyangFn = (params: IPage & QuotationSearchForm) => Promise<FeiyangList>
export const getFeiyang: GetFeiyangFn = async (params) => {
  const { data } = await http.get<FeiyangList>('/quotation/feiyang', { params })
  return zFeiyangList.parse(data)
}
type CreateFeiyangFn = (body: FeiyangCreateForm) => Promise<string>
export const createFeiyang: CreateFeiyangFn = async (body) => {
  const { data } = await http.post<string>('/quotation/feiyang', body)
  return data
}
type UpdateFeiyangFn = (body: FeiyangUpdateForm) => Promise<string>
export const updateFeiyang: UpdateFeiyangFn = async (body) => {
  const { data } = await http.put<string>('/quotation/feiyang', body)
  return data
}
type DeleteFeiyangFn = (body: number[]) => Promise<string>
export const deleteFeiyang: DeleteFeiyangFn = async (body) => {
  const { data } = await http.delete<string>('/quotation/feiyang', { data: body })
  return data
}

// hqb quotation
type GetHqbFn = (params: IPage & QuotationSearchForm) => Promise<HqbList>
export const getHqb: GetHqbFn = async (params) => {
  const { data } = await http.get<HqbList>('/quotation/hqb', { params })
  return zHqbList.parse(data)
}
type CreateHqbFn = (body: HqbCreateForm) => Promise<string>
export const createHqb: CreateHqbFn = async (body) => {
  const { data } = await http.post<string>('/quotation/hqb', body)
  return data
}
type UpdateHqbFn = (body: HqbUpdateForm) => Promise<string>
export const updateHqb: UpdateHqbFn = async (body) => {
  const { data } = await http.put<string>('/quotation/hqb', body)
  return data
}
type DeleteHqbFn = (body: number[]) => Promise<string>
export const deleteHqb: DeleteHqbFn = async (body) => {
  const { data } = await http.delete('/quotation/hqb', { data: body })
  return data
}
