import type { DeviceInfo, BatteryInfo, DeviceForm } from "../types"
import type { InjectionKey } from "vue"

export const DEVICE_STORE: InjectionKey<DeviceStore> = Symbol('deviceStore')

export enum ConnStatus {
  IDLE = 'idle',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  PLUGIN_NOT_INSTALLED = 'plugin_not_installed',
}

export interface DeviceStore {
  battery: BatteryInfo
  deviceChipMap: Map<string, DeviceChip>
  deviceMap: Map<string, DeviceInfo>
  infoMap: Map<string, DeviceForm>

  screenshot: string
  status: ConnStatus
  selectedDevice: string
  
  printPreview: string
  printPreviewVisible: boolean
}

interface DeviceChip {
  Name: string
  Chip: string
}

export const deviceConfig = {
  api: 'http://192.168.10.3:9999',
  ws: 'ws://192.168.10.3:10000/ws',
}
