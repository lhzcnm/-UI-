import type { RechargeList, RechargeListParams, RechargeUpdateParams } from '@/inters/recharge'
import { zRecharge } from '@/inters/recharge'
import { zRechargePackage, type RechargePackage, type RechargePackageCreateParams, type RechargePackageUpdateParams } from '@/inters/recharge/package'
import http from '@/utils/http'

type RechargeListFn = (body: RechargeListParams) => Promise<RechargeList>
export const getRecharges: RechargeListFn = async (body) => {
  const { data } = await http.post<RechargeList>('/payment/list', body)
  return { ...data, list: data.list.map(item => zRecharge.parse(item)) }
}

type RechargeUpdateFn = (params: RechargeUpdateParams) => Promise<void>
export const updateRecharge: RechargeUpdateFn = async (params) => {
  await http.put('/payment/edit', params )
}

type RechargeDeleteFn = (data: number[]) => Promise<void>
export const deleteRecharges: RechargeDeleteFn = async (data) => {
  await http.delete('/payment', { data })
}

// Package
type RechargePackageListFn = () => Promise<RechargePackage[]>
export const getRechargePackages: RechargePackageListFn = async () => {
  const { data } = await http.get<RechargePackage[]>('/shop')
  return data.slice(1).map(item => zRechargePackage.parse(item))
}

type RechargePackageCreateFn = (params: RechargePackageCreateParams) => Promise<RechargePackage>
export const createRechargePackage: RechargePackageCreateFn = async (params) => {
  const { data } = await http.post('/shop', params)
  return zRechargePackage.parse(data)
}

type RechargePackageUpdateFn = (params: RechargePackageUpdateParams) => Promise<number>
export const updateRechargePackage: RechargePackageUpdateFn = async (params) => {
  return (await http.put('/shop', params)).data
}

type RechargePackageDeleteFn = (data: number[]) => Promise<void>
export const deleteRechargePackages: RechargePackageDeleteFn = async (data) => {
  await http.delete('/shop', { data })
}
