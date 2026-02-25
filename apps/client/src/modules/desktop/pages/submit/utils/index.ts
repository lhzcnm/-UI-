import type { IK } from "@3un/shared"

import type { OrderTableView } from "@/api/orders"
import type { ServiceCols } from "@/api/services"

export const SUBMIT_STORE: IK<SubmitStore> = Symbol("submit")

export interface SubmitStore {
  visibleHeaderFilter: boolean,

  serviceCols: ServiceCols[],
  selectHeaders: string[],
  rawOrders: OrderTableView[],
  
  selectId: number | undefined,
  page: number,
  limit: number,
  view: 'submit' | 'preview',
}
