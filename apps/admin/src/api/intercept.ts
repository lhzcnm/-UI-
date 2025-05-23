import type { Intercept, InterceptCreateParams, InterceptUpdateParams } from '@/inters/intercept'
import { zIntercept } from '@/inters/intercept'
import http from '@/utils/http'

type InterceptListFn = () => Promise<Intercept[]>
export const getIntercepts: InterceptListFn = async () => {
  const { data } = await http.get<Intercept[]>('/blocked/ip')
  return data.map(item => zIntercept.parse(item))
}

type InterceptCreateFn = (params: InterceptCreateParams) => Promise<Intercept>
export const createIntercept: InterceptCreateFn = async (params) => {
  const { data } = await http.post<Intercept>('/blocked/ip', params)
  return zIntercept.parse(data)
}

type InterceptUpdateFn = (params: InterceptUpdateParams) => Promise<number>
export const updateIntercept: InterceptUpdateFn = async (params) => {
  return (await http.put<number>('/blocked/ip', params)).data
}

type InterceptDeleteFn = (id: number) => Promise<void>
export const deleteIntercept: InterceptDeleteFn = async (id) => {
  await http.delete(`/blocked/ip?id=${id}`)
}
