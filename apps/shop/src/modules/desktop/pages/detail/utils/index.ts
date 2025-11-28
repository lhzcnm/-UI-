import type { OrderForm, OrderView, SubmitParams } from "@/inters/order"
import type { IK } from "@3un/shared"
import type { PayType } from "./types"
import type { Ticket } from "@/inters/ticket"

export interface DetailStore {
  visibleQrcode: boolean,
  visibleConfirm: boolean,
  visibleTicket: boolean,

  orderForm: OrderForm,
  submitForm: SubmitParams,
  rawOrders: OrderView[],
  tickets: Ticket[],
  orderId: number | undefined,
  
  payType: PayType,
  url: string,
}

export const DETAIL_STORE: IK<DetailStore> = Symbol("detail-store")
