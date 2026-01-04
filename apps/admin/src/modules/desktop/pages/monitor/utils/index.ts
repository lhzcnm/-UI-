import type { MonitorServerForm, MonitorServerList, MonitorServerSearch } from "@/inters/monitor/server"
import type { MonitorUserCreate, MonitorUserList, MonitorUserSearch } from "@/inters/monitor/user"
import type { IK } from "@3un/shared"

export const MONITOR_USER_STORE: IK<MonitorUserStore> = Symbol("monitor-users")
export const MONITOR_SERVER_STORE: IK<MonitorServerStore> = Symbol("monitor-servers")

export interface MonitorUserStore {
  visibleBase: boolean,

  formSearch: MonitorUserSearch,
  formBase: MonitorUserCreate,
  users: MonitorUserList,

  page: number,
  limit: number,
  refresh: boolean,
  id: number | undefined,
}

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
