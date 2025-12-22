import type { AxiosResponse } from 'axios'
import type { OrderBatchEditItem, OrderList, OrderListParams, OrderUpdateParams, OrderUpdateStatusParam, OrderVerifyParam } from '@/inters/orders'

import { zOrder } from '@/inters/orders'
import http from '@/utils/http'
import type { IPage } from '@3un/shared'
import { zMallOrder, type MallOrderList, type MallOrderRefundParams, type MallOrderRefundResp } from '@/inters/orders/mall'

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

// Order Clean
type OrderCleanFn = (time: string) => Promise<AxiosResponse>
export const cleanOrder: OrderCleanFn = (time) => {
  return http.get(`/order/clean?time=${time}`)
}

// mall orders
type OrderMallListFn = (params: IPage) => Promise<MallOrderList>
export const getMallOrders: OrderMallListFn = async (params) => {
  const { data } = await http.get<MallOrderList>('/order/mall', { params })
  return { ...data, list: data.list.map((item) => zMallOrder.parse(item)) }
}

// mall order refund
type OrderMallRefundFn = (data: MallOrderRefundParams) => Promise<MallOrderRefundResp>
export const refundMallOrder: OrderMallRefundFn = async (body) => {
  const { data } = await http.post('/mall/refund/apply', body)
  return data
}
