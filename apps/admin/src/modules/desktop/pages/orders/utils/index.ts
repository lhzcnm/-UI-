import type { OrderList, OrderSearchForm, OrderUpdateForm } from "@/inters/orders"
import type { IK } from "@3un/shared"

export * from './column'

export const ORDER_STORE: IK<OrderStore> = Symbol('orders')

export interface OrderStore {
  orders: OrderList
  formSearch: OrderSearchForm
  formUpdate: OrderUpdateForm
  visibleSearch: boolean
  visibleUpdate: boolean
  index: number | undefined
  refresh: boolean
  page: number
  limit: number
}
