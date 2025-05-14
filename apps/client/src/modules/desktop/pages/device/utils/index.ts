import type { InjectionKey } from "vue"
import type { DeviceInfo } from "../types"

export const DEVICE_STORE: InjectionKey<DeviceStore> = Symbol('deviceStore')

export enum ConnStatus {
  IDLE = 'idle', // 未连接
  CONNECTED = 'connected', // 已连接
  DISCONNECTED = 'disconnected', // 已断开
  PLUGIN_NOT_INSTALLED = 'plugin_not_installed', // 插件未安装
}

export interface DeviceStore {
  ws: WebSocket | null
  status: ConnStatus
  info: DeviceInfo
  screenshot: string
}

export const deviceConfig = {
  api: 'http://192.168.10.3:9999',
  ws: 'ws://192.168.10.3:10000/ws',
}
