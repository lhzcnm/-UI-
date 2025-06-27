import type { StatOrder, StatService, StatParams } from "@/inters/dashboard"
import http from "@/utils/http"

type IncomeStatFn = (params: StatParams) => Promise<Record<string, string>>
export const getIncome: IncomeStatFn = async (params) => {
  return (await http.post('/dashboard/income', params)).data
}

type IncomeTrendFn = () => Promise<Record<string, string>>
export const getIncomeTrend: IncomeTrendFn = async () => {
  return (await http.get('/dashboard/income-day')).data
}

type OrderStatFn = (params: StatParams) => Promise<StatOrder[]>
export const getOrder: OrderStatFn = async (params) => {
  return (await http.post('/dashboard/order', params)).data
}

type OrderTrendFn = () => Promise<StatOrder[]>
export const getOrderTrend: OrderTrendFn = async () => {
  return (await http.get('/dashboard/order-day')).data
}

type ServiceStatFn = (params: StatParams) => Promise<StatService[]>
export const getService: ServiceStatFn = async (params) => {
  return (await http.post('/dashboard/serviceCount', params)).data
}
