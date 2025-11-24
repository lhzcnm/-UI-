import type { SubmitParams } from "@/inters/order"
import type { IK } from "@3un/shared"

export interface ServiceStore {
  visibleFilter: boolean,
  visibleDetail: boolean,
  visiblePay: boolean,
  submited: boolean,

  createOrder: SubmitParams,
  url: string,
}

export const SERVICE_STORE: IK<ServiceStore> = Symbol("service-store")
