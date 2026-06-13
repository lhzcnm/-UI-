import type { IK } from "@3un/shared"

import type { MonitorServerForm, MonitorServerList, MonitorServerSearch } from "@/inters/monitor/server"

export const MONITOR_SERVER_STORE: IK<MonitorServerStore> = Symbol("monitor-server")

export interface MonitorServerStore {
  visibleBase: boolean,
  visibleSearch: boolean,

  formSearch: MonitorServerSearch,
  formBase: MonitorServerForm,
  servers: MonitorServerList,

  page: number,
  limit: number,
  refresh: boolean,
  serverId: number | undefined,
  domainId: number | undefined,
}
