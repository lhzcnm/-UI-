import type { Ticket } from "@/inters/ticket";
import type { IK } from "@3un/shared";

export interface HistoryStore {
  visibleSearch: boolean,
  visibleTicket: boolean,

  tickets: Ticket[],
  orderId: number | undefined,
}

export const HISTORY_STORE: IK<HistoryStore> = Symbol("history-store")
