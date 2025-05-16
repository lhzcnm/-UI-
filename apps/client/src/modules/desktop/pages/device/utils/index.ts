import type { InjectionKey } from "vue"
import type { DeviceInfo, BatteryInfo } from "../types"

export const DEVICE_STORE: InjectionKey<DeviceStore> = Symbol('deviceStore')

export enum ConnStatus {
  IDLE = 'idle',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  PLUGIN_NOT_INSTALLED = 'plugin_not_installed',
}

export interface DeviceStore {
  ws: WebSocket | null
  status: ConnStatus
  info: DeviceInfo
  screenshot: string
  battery: BatteryInfo
  deviceChip: {
    Name: string
    Chip: string
  }
}

export const deviceConfig = {
  api: 'http://192.168.10.3:9999',
  ws: 'ws://192.168.10.3:10000/ws',
}
