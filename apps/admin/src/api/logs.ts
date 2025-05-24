import type { LogList, LogListParams } from '@/inters/logs'
import { zLog } from '@/inters/logs'
import http from '@/utils/http'

type LogListFn = (params: LogListParams) => Promise<LogList>
export const getLogs: LogListFn = async (params) => {
  const { data } = await http.post<LogList>('/logs', params)
  return { ...data, list: data.list.map(item => zLog.parse(item)) }
}

type LogDeleteFn = (data: number[]) => Promise<void>
export const deleteLogs: LogDeleteFn = async (data) => {
  await http.delete('/logs', { data })
}
