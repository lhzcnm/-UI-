import type { IPage } from "@3un/shared"

import { zFeiyangList, type FeiyangCreateForm, type FeiyangList, type FeiyangUpdateForm } from "@/inters/quotation/feiyang"
import http from "@/utils/http"
import { zApiEnum, type ApiEnum, type QuotationSearchForm } from "@/inters/quotation"
import { zHqbList, type HqbCreateForm, type HqbList, type HqbUpdateForm } from "@/inters/quotation/hqb"
import { zHkList, type HkCreateForm, type HkList } from "@/inters/quotation/hk"
import { zRemark, type RemarkCreate, type RemarkList, type RemarkSearchForm, type RemarkUpdate } from "@/inters/quotation/remark"

// feiyang quotation
type GetFeiyangFn = (params: IPage & QuotationSearchForm) => Promise<FeiyangList>
export const getFeiyang: GetFeiyangFn = async (params) => {
  const { data } = await http.get<FeiyangList>('/quotation/feiyang', { params })
  return zFeiyangList.parse(data)
}
type CreateFeiyangFn = (body: FeiyangCreateForm) => Promise<null>
export const createFeiyang: CreateFeiyangFn = async (body) => {
  const { data } = await http.post<null>('/quotation/feiyang', body)
  return data
}
type UpdateFeiyangFn = (body: FeiyangUpdateForm) => Promise<null>
export const updateFeiyang: UpdateFeiyangFn = async (body) => {
  const { data } = await http.put<null>('/quotation/feiyang', body)
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
type CreateHqbFn = (body: HqbCreateForm) => Promise<null>
export const createHqb: CreateHqbFn = async (body) => {
  const { data } = await http.post<null>('/quotation/hqb', body)
  return data
}
type UpdateHqbFn = (body: HqbUpdateForm) => Promise<null>
export const updateHqb: UpdateHqbFn = async (body) => {
  const { data } = await http.put<null>('/quotation/hqb', body)
  return data
}
type DeleteHqbFn = (body: number[]) => Promise<string>
export const deleteHqb: DeleteHqbFn = async (body) => {
  const { data } = await http.delete('/quotation/hqb', { data: body })
  return data
}

// Hk quotation
type GetHkFn = (params: IPage & QuotationSearchForm) => Promise<HkList>
export const getHk: GetHkFn = async (params) => {
  const { data } = await http.get<HkList>('/quotation/hk', { params })
  return zHkList.parse(data)
}
type CreateHkFn = (body: HkCreateForm) => Promise<null>
export const createHk: CreateHkFn = async (body) => {
  const { data } = await http.post<null>('/quotation/hk', body)
  return data
}
type UpdateHkFn = (body: HqbUpdateForm) => Promise<null>
export const updateHk: UpdateHkFn = async (body) => {
  const { data } = await http.put<null>('/quotation/hk', body)
  return data
}
type DeleteHkFn = (body: number[]) => Promise<string>
export const deleteHk: DeleteHkFn = async (body) => {
  const { data } = await http.delete('/quotation/hk', { data: body })
  return data
}

type GetAppearanceFn = () => Promise<ApiEnum[]>
export const getAppearances: GetAppearanceFn = async () => {
  const { data } = await http.get<ApiEnum[]>('/quotation/feiyang/listAppearance')
  return data.map(item => zApiEnum.parse(item))
}
type GetColorFn = () => Promise<ApiEnum[]>
export const getColors: GetColorFn = async () => {
  const { data } = await http.get<ApiEnum[]>('/quotation/hqb/listColor')
  return data.map(item => zApiEnum.parse(item))
}
type GetStatusFn = () => Promise<ApiEnum[]>
export const getStatues: GetStatusFn = async () => {
  const { data } = await http.get<ApiEnum[]>('/quotation/hqb/listStatus')
  return data.map(item => zApiEnum.parse(item))
}
type GetDeviceTypesFn = () => Promise<ApiEnum[]>
export const GetDeviceTypes: GetDeviceTypesFn = async () => {
  const { data } = await http.get<ApiEnum[]>('/quotation/hk/listDeviceType')
  return data.map(item => zApiEnum.parse(item))
}
type GetDeviceBrandFn = () => Promise<ApiEnum[]>
export const getDeviceBrand: GetDeviceBrandFn = async () => {
  const { data } = await http.get<ApiEnum[]>("/quotation/phone/brand")
  return data.map(item => zApiEnum.parse(item))
}

// quotation remarks
type getRemarkFn = (params: RemarkSearchForm) => Promise<RemarkList>
export const getRemarks: getRemarkFn = async (params) => {
  const { data } = await http.get<RemarkList>('/quotation/remark', { params })
  return { ...data, list: data.list.map(item => zRemark.parse(item)) }
}

type createRemarkFn = (body: RemarkCreate) => Promise<null>
export const createRemark: createRemarkFn = async (body) => {
  const { data } = await http.post<null>('/quotation/remark', body)
  return data
}

type updateRemarkFn = (body: RemarkUpdate) => Promise<null>
export const updateRemark: updateRemarkFn = async (body) => {
  const { data } = await http.put('/quotation/remark', body)
  return data
}

type delateRemarkFn = (body: number[]) => Promise<null>
export const deleteRemark: delateRemarkFn = async (body) => {
  const { data } = await http.delete('/quotation/remark', { data: body })
  return data
}
