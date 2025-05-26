import type { RechargeList, RechargeListParams, RechargeUpdateParams } from '@/inters/recharge'
import { zRecharge } from '@/inters/recharge'
import http from '@/utils/http'

type RechargeListFn = (body: RechargeListParams) => Promise<RechargeList>
export const getRecharges: RechargeListFn = async (body) => {
  const { data } = await http.post<RechargeList>('/payment/list', body)
  return { ...data, list: data.list.map(item => zRecharge.parse(item)) }
}

type RechargeUpdateFn = (params: RechargeUpdateParams) => Promise<void>
export const updateRecharge: RechargeUpdateFn = async (params) => {
  await http.put('/payment/edit', { params })
}

type RechargeDeleteFn = (data: number[]) => Promise<void>
export const deleteRecharges: RechargeDeleteFn = async (data) => {
  await http.delete('/payment', { data })
}
