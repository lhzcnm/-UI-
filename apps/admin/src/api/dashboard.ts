import type { OrderStatItem, RangeStatParams, TodoCountItem } from "@/inters/dashboard"
import type { User } from "@/inters/users"
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

type TodoCountFn = () => Promise<TodoCountItem>
export const getTodoCount: TodoCountFn = async () => {
  return (await http.get('/dashboard/todo-count')).data
}

type UserRankFn = () => Promise<User[]>
export const getUserRank: UserRankFn = async () => {
  return (await http.get('/dashboard/rank')).data
}
