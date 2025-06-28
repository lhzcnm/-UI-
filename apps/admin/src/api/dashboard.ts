import type { OrderStatItem, RangeStatParams } from "@/inters/dashboard"
import http from "@/utils/http"

type IncomeRangeFn = (params: RangeStatParams) => Promise<Record<string, string>>
export const getIncomeRange: IncomeRangeFn = async (params) => {
  return (await http.post('/dashboard/income', params)).data
}

type IncomeTrendFn = () => Promise<Record<string, string>>
export const getIncomeTrend: IncomeTrendFn = async () => {
  return (await http.get('/dashboard/income-day')).data
}

type OrderRangeFn = (params: RangeStatParams) => Promise<OrderStatItem[]>
export const getOrderRange: OrderRangeFn = async (params) => {
  return (await http.post('/dashboard/order', params)).data
}

type OrderTrendFn = () => Promise<OrderStatItem[]>
export const getOrderTrend: OrderTrendFn = async () => {
  return (await http.get('/dashboard/order-day')).data
}

type ServiceRangeFn = (params: RangeStatParams) => Promise<OrderStatItem[]>
export const getServiceRange: ServiceRangeFn = async (params) => {
  return (await http.post('/dashboard/service', params)).data
}

type RealtimeOrderFn = () => Promise<OrderStatItem[]>
export const getRealtimeOrder: RealtimeOrderFn = async () => {
  return (await http.get('/dashboard/order-realtime')).data
}
