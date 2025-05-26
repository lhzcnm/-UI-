import type { IK } from "@3un/shared"
import type { DeviceInfo, DeviceForm, ProductItem, Device } from "../types"

export interface DeviceStore {
  deviceMap: Map<string, Device>
  status: 'list' | 'detail' | 'wait' | 'plugin'
  screenshot: string
  selected: string
}

export const DEVICE_STORE: IK<DeviceStore> = Symbol('device')
export const DEVICE_CONFIG = {
  api: 'http://192.168.10.3:9999',
  ws: 'ws://192.168.10.3:10000/ws',
}
// export const DEVICE_CONFIG = {
//   api: 'http://localhost:9999',
//   ws: 'ws://localhost:10000/ws',
// }

export function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i]
}

export const getCopyToken = (info: DeviceForm) => ([
  ['序列号', info.SerialNumber],
  ['串号', info.Imei],
  ['型号号码', `${info.ModelNumber} ${info.RegionInfo}`],
  ['主板序号', info.MLBSerialNumber],
  ['系统版本', `${info.ProductVersion} (${info.BuildVersion})`],
  ['ECID', info.UniqueChipID],
  ['UDID', info.UniqueDeviceID],
  ['激活状态', info.ActivationState],
  ['网络锁', info.NetworkLock],
  ['激活锁', info.ActivationLock],
  ['保修期限', info.Warranty],
  ['iCloud', info.iCloud],
  ['CPU', info.CPU],
])

export const getDeviceForm = (info: DeviceInfo, product: ProductItem) => ({
  ModelNumber: info.ModelNumber,
  SerialNumber: info.SerialNumber,
  MLBSerialNumber: info.MLBSerialNumber,
  Imei: info.InternationalMobileEquipmentIdentity,
  ProductVersion: info.ProductVersion,
  BuildVersion: info.BuildVersion,
  RegionInfo: info.RegionInfo,
  UniqueChipID: info.UniqueChipID.toString(),
  UniqueDeviceID: info.UniqueDeviceID,
  ActivationState: info.ActivationState ? '已激活' : '未激活',
  iCloud: info.CloudBackupEnabled ? '已开启' : '未开启',
  CPU: product.Chip || '--',
  Warranty: '--',
  NetworkLock: '--',
  ActivationLock: '--',
})

export function getPrintPayload(device: Device) {
  const { info, product, battery, form } = device
  return JSON.stringify({
    DeviceName: product.Name,
    Color: product.Color,
    Imei: form.Imei,
    MLBSerialNumber: info.MLBSerialNumber,
    ProductVersion: info.ProductVersion,
    RegionInfo: info.RegionInfo,
    ModelNumber: info.ModelNumber,
    TotalDiskCapacity: info.TotalDiskCapacity,
    NominalChargeCapacity: battery.NominalChargeCapacity,
    DesignCapacity: battery.DesignCapacity,
    CycleCount: battery.CycleCount,
  })
}
