import type { IK } from "@3un/shared"

import type { MonitorUserCreate, MonitorUserList, MonitorUserSearch } from "@/inters/monitor/user"
import type { MonitorServerForm, MonitorServerList, MonitorServerSearch } from "@/inters/monitor/server"

export const MONITOR_USER_STORE: IK<MonitorUserStore> = Symbol("monitor-user")
export const MONITOR_SERVER_STORE: IK<MonitorServerStore> = Symbol("monitor-server")

export interface MonitorUserStore {
  visibleBase: boolean,
  visibleTool: boolean,

  users: MonitorUserList,
  userFormSearch: MonitorUserSearch,
  userForm: MonitorUserCreate,

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
