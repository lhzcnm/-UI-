import type { ServiceDetail } from "@/api/services"

// Store
export type DeviceStatus = 'list' | 'detail' | 'wait' | 'plugin' | 'version' | 'printView'
export type ScreenshotStatus = 'wait' | 'success' | 'fail'

export interface DeviceStore {
  deviceStatus     : DeviceStatus
  prevStatus       : DeviceStatus
  screenshotStatus : ScreenshotStatus
  visiblePrint     : boolean
  visibleCreateLabel: boolean
  visibleActivate: boolean
  visibleImage: boolean
  previewImage: Blob | null
  printIndex       : string
  screenshot       : string
  selected         : string
  hasNewVersion    : boolean
  queryServices    : ServiceDetail[]
}
