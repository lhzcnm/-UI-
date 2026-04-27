import { zRechargeTodayItem, type OrderStatItem, type RangeStatParams, type RechargeTodayList, type RechargeTodayParams, type TodoCountItem, type UserStatItem } from "@/inters/dashboard"
import type { UserList } from "@/inters/users"
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

type UserRankFn = (page: number) => Promise<UserList>
export const getUserRank: UserRankFn = async (page) => {
  return (await http.get(`/dashboard/rank?page=${page}`)).data
}

type UserStatFn = () => Promise<UserStatItem>
export const getUserToday: UserStatFn = async () => {
  return (await http.get('/dashboard/user-stat')).data
}

type UserRechargeFn = (body: RechargeTodayParams) => Promise<RechargeTodayList>
export const getTodayRecharge: UserRechargeFn = async (body) => {
  const { data } = await http.post<RechargeTodayList>('/dashboard/today-recharge', body)
  return { ...data, list: data.list.map(item => zRechargeTodayItem.parse(item)) }
}
