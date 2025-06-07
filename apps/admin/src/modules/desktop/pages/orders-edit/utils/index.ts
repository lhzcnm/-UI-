import type { OrderBatchEditItem } from "@/inters/orders"
import type { IK } from "@3un/shared"
import type { ORDER_STATUS } from "@3un/utils"

export const STORE: IK<OrderEditStore> = Symbol('OrderEditStore')

export interface OrderEditStore {
  isCode: boolean
  serviceId: number | undefined
  status: ORDER_STATUS | undefined
  items: OrderBatchEditItem[]
}
