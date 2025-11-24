import type { IK } from "@3un/shared";

export interface HistoryStore {
  visibleSearch: boolean,
}

export const HISTORY_STORE: IK<HistoryStore> = Symbol("history-store")
