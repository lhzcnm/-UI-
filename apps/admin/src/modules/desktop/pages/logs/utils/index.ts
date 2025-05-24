import type { LogList, LogSearch } from '@/inters/logs'
import type { IK } from '@3un/shared'

export interface LogStore {
  logs: LogList
  formSearch: LogSearch
  visibleSearch: boolean
  refresh: boolean
  page: number
  limit: number
}

export const LOG_STORE: IK<LogStore> = Symbol('logStore')
