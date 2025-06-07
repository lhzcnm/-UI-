import type { OrderBatchEditItem, OrderList, OrderListParams, OrderUpdateParams, OrderUpdateStatusParam, OrderVerifyParam } from '@/inters/orders'
import type { AxiosResponse } from 'axios'

import { zOrder } from '@/inters/orders'
import http from '@/utils/http'

// Order
type OrderListFn = (params: OrderListParams) => Promise<OrderList>
export const getOrders: OrderListFn = async (params) => {
  const { data } = await http.post<OrderList>('/order/search', params)
  return { ...data, list: data.list.map((item) => zOrder.parse(item)) }
}

// Update
type OrderUpdateFn = (params: OrderUpdateParams) => Promise<number>
export const updateOrder: OrderUpdateFn = async (params) => {
  return (await http.put('/order', params)).data
}

// Export
type OrderExportFn = (codeIds: number[]) => Promise<AxiosResponse>
export const exportOrder: OrderExportFn = (codeIds) => {
  return http.post('/order/export', codeIds, { responseType: 'blob' })
}

// Push
type OrderPushFn = (codeIds: number[]) => Promise<AxiosResponse>
export const pushOrder: OrderPushFn = (codeIds) => {
  return http.post('/order/push', codeIds)
}

// Update Code Status
type OrderUpdateCodeStatusFn = (params: OrderUpdateStatusParam[]) => Promise<AxiosResponse>
export const updateCodeStatus: OrderUpdateCodeStatusFn = (params) => {
  return http.put('/order/status', params)
}

// Re Submit
type OrderReSubmitFn = (codeIds: number[]) => Promise<AxiosResponse>
export const reSubmitOrder: OrderReSubmitFn = (codeIds) => {
  return http.post('/order/batch/resubmit', codeIds)
}

// Batch Update Order
type OrderBatchUpdateFn = (params: OrderBatchEditItem[]) => Promise<AxiosResponse>
export const batchUpdateOrder: OrderBatchUpdateFn = (params) => {
  return http.put('/order/batch', params)
}

// Order Verify
type OrderVerifyFn = (params: OrderVerifyParam[]) => Promise<AxiosResponse>
export const updateOrderVerify: OrderVerifyFn = (params) => {
  return http.put('/order/verify', params)
}
