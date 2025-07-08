import type { OrderList, OrderSearchForm, OrderUpdateForm, OrderCleanForm } from "@/inters/orders"
import type { IK } from "@3un/shared"

export const ORDER_STORE: IK<OrderStore> = Symbol('orders')
export const VERIFY_STORE: IK<VerifyStore> = Symbol('verify')

export interface OrderStore {
  orders: OrderList

  formSearch: OrderSearchForm
  formUpdate: OrderUpdateForm
  formClean: OrderCleanForm

  visibleSearch: boolean
  visibleUpdate: boolean
  visibleClear: boolean

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
