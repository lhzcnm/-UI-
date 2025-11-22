import type { OrderForm, OrderView, SubmitParams } from "@/inters/order";
import type { IK } from "@3un/shared";
import type { PayType } from "./types";

export interface DetailStore {
  visibleQrcode: boolean,
  visibleConfirm: boolean,

  orderForm: OrderForm,
  submitForm: SubmitParams,
  rawOrders: OrderView[],
  
  payType: PayType,
  url: string,
}

export const DETAIL_STORE: IK<DetailStore> = Symbol("detail-store")
