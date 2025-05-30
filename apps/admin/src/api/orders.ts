import type { OrderList, OrderListParams } from '@/inters/orders'
import { zOrder } from '@/inters/orders'
import http from '@/utils/http'

// Order
type OrderListFn = (params: OrderListParams) => Promise<OrderList>
export const getOrders: OrderListFn = async (params) => {
  const { data } = await http.post<OrderList>('/order/search', params)
  return { ...data, list: data.list.map((item) => zOrder.parse(item)) }
}
