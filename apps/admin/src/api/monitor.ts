import { zMonitorServer, type MonitorServerList, type MonitorServerSearchForm, type MonitorServerUpdate } from "@/inters/monitor/server"
import { zMonitorUser, type MonitorUserCreate, type MonitorUserList, type MonitorUserSearchForm, type MonitorUserUpdate } from "@/inters/monitor/user"
import http from "@/utils/http"

type MonitorUserListFn = (body: MonitorUserSearchForm) => Promise<MonitorUserList>
export const getMonitorUsers: MonitorUserListFn = async (body) => {
  const { data } = await http.post<MonitorUserList>("/monitorUser/list", body)
  return { ...data, list: data.list.map(item => zMonitorUser.parse(item)) }
}

type MonitorUserCreateFn = (body: MonitorUserCreate) => Promise<void>
export const createMonitorUser: MonitorUserCreateFn = async (body) => {
  await http.post("/monitorUser/add", body)
}

type MonitorUserUpdateFn = (body: MonitorUserUpdate) => Promise<void>
export const updateMonitorUser: MonitorUserUpdateFn = async (body) => {
  await http.put("/monitorUser", body)
}

type MonitorUserDeleteFn = (ids: number[]) => Promise<void>
export const deleteMonitorUser: MonitorUserDeleteFn = async (ids) => {
  await http.delete("/monitorUser", { data: ids })
}

type MonitorServerListFn = (body: MonitorServerSearchForm) => Promise<MonitorServerList>
export const getMonitorServers: MonitorServerListFn = async (body) => {
  const { data } = await http.post<MonitorServerList>("/domain/list", body)
  return { ...data, list: data.list.map(item => zMonitorServer.parse(item)) }
}

type MonitorServerUpdateFn = (body: MonitorServerUpdate) => Promise<void>
export const updateMonitorServer: MonitorServerUpdateFn = async (body) => {
  await http.put("/domain", body)
}
