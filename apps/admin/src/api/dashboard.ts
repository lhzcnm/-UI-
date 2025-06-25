import type { StatParams } from "@/inters/dashboard"
import http from "@/utils/http"

type IncomeStatFn = (params: StatParams) => Promise<Record<string, string>>
export const getIncome: IncomeStatFn = async (params) => {
  return (await http.post('/dashboard/income', params)).data
}

type OrderStatFn = (params: StatParams) => Promise<any>
export const getOrder: OrderStatFn = async (params) => {
  return (await http.post('/dashboard/order', params)).data
}

type ServiceStatFn = (params: StatParams) => Promise<any>
export const getService: ServiceStatFn = async (params) => {
  return (await http.post('/dashboard/serviceCount', params)).data
}
