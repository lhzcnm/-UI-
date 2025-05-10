import type { InjectionKey } from "vue"
import type { DeviceInfo } from "../types"

export const DEVICE_STORE: InjectionKey<DeviceStore> = Symbol('deviceStore')

export interface DeviceStore {
  info: DeviceInfo
}
