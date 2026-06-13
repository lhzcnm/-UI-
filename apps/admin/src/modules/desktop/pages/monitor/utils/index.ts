import type { MonitorServerForm, MonitorServerList, MonitorServerSearch } from "@/inters/monitor/server"
import type { IK } from "@3un/shared"

export const MONITOR_SERVER_STORE: IK<MonitorServerStore> = Symbol("monitor-servers")

export interface MonitorServerStore {
  visibleBase: boolean,
  visibleSearch: boolean,

  formSearch: MonitorServerSearch,
  formBase: MonitorServerForm,
  servers: MonitorServerList,

  page: number,
  limit: number,
  refresh: boolean,
  domainId: number | undefined,
}
