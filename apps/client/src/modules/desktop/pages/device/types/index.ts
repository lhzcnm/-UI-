import type { ServiceDetail } from "@/api/services"

// Store
export type DeviceStatus = 'list' | 'detail' | 'wait' | 'plugin' | 'version' | 'printView'
export type ScreenshotStatus = 'wait' | 'success' | 'fail'

export interface DeviceStore {
  // deviceMap        : Map<string, DeviceMapItem>
  // recoverDeviceMap : Map<string, DeviceRecoveryMapItem>,
  deviceStatus     : DeviceStatus
  prevStatus       : DeviceStatus
  screenshotStatus : ScreenshotStatus
  visiblePrint     : boolean
  printIndex       : string
  screenshot       : string
  selected         : string
  hasNewVersion    : boolean
  queryServices    : ServiceDetail[]
}
