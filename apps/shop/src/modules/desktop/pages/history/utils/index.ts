import type { ServiceDetail } from "@/inters/services"
import type { Ticket } from "@/inters/ticket"
import type { IK } from "@3un/shared"

export interface HistoryStore {
  visibleRefund: boolean,
  visibleTicket: boolean,

  // orders: IList<Order>,
  tickets: Ticket[],
  services: ServiceDetail[],

  // searchForm: OrderSearchForm,
  orderId: number | undefined,
}

export const HISTORY_STORE: IK<HistoryStore> = Symbol('history-store')
