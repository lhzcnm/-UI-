import type { OrderList, OrderSearchForm, OrderUpdateForm, OrderCleanForm } from "@/inters/orders"
import type { MallOrder } from "@/inters/orders/mall"
import type { IK, IList } from "@3un/shared"

export const ORDER_STORE: IK<OrderStore> = Symbol('orders')
export const VERIFY_STORE: IK<VerifyStore> = Symbol('verify')
export const MALL_STORE: IK<MallStore> = Symbol('mall')

export interface OrderStore {
  orders: OrderList

  formSearch: OrderSearchForm
  formUpdate: OrderUpdateForm
  formClean: OrderCleanForm

  visibleSearch: boolean
  visibleUpdate: boolean
  visibleClear: boolean
  visibleAutoClean: boolean

  refresh: boolean
  index  : number | undefined
  page   : number
  limit  : number
}

export interface VerifyStore {
  orders: OrderList

  refresh: boolean
  page   : number
  limit  : number
}

export interface MallStore {
  page: number
  limit: number

  mallOrders: IList<MallOrder>
}
