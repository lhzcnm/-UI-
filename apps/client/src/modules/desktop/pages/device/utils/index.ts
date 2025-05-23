import type { DeviceInfo, BatteryInfo, DeviceForm } from "../types"
import type { IK } from "@3un/shared"

export const DEVICE_STORE: IK<DeviceStore> = Symbol('deviceStore')

export enum ConnStatus {
  IDLE                 = 'idle',
  CONNECTED            = 'connected',
  DISCONNECTED         = 'disconnected',
  PLUGIN_NOT_INSTALLED = 'plugin_not_installed',
}

export interface DeviceStore {
  battery: BatteryInfo
  deviceMap: Map<string, DeviceInfo>
  productMap: Map<string, ProductInfo>
  infoMap: Map<string, DeviceForm>

  screenshot: string
  status: ConnStatus
  selectedDevice: string
}

interface ProductInfo {
  Name: string
  Chip: string
  Color: string
}

export const DEVICE_CONFIG = {
  api: 'http://localhost:9999',
  ws: 'ws://localhost:10000/ws',
}
