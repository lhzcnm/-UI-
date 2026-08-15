import type { IK } from "@3un/shared"

import type { OrderTableView } from "@/api/orders"
import type { ServiceCols } from "@/api/services"
import type { XTableV2Column } from "@3un/ui"

export const SUBMIT_STORE: IK<SubmitStore> = Symbol("submit")

export interface SubmitStore {
  visibleHeaderFilter: boolean,
  visibleUnlockRecommend: boolean,
  visibleGress: boolean,

  serviceCols: ServiceCols[],
  selectHeaders: string[],
  rawOrders: OrderTableView[],

  selectId: number,
  selectOrderId: number | undefined,
  // page: number,
  // limit: number,
  view: 'submit' | 'preview',

  refreshProgress: boolean,

  filterData: Record<string, string>,
  visibleFilters: Record<string, string[]>,
  popoverVisible: Record<string, boolean>,
  userChangedFilters: Record<string, boolean>,

  onClickHeaderDelete?: (column: XTableV2Column<OrderTableView>) => void,
}
