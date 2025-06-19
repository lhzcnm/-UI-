import type { DeviceStore, DeviceMapItem, DeviceSummary } from "../types"
import type { IK } from "@3un/shared"

import { stripHtml } from '@3un/utils'

export * from './websocket'

export const STORE: IK<DeviceStore> = Symbol('device')

export function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + units[i]
}

export const getCopyToken = (info: DeviceSummary) => ([
  ['序列号', info.SerialNumber],
  ['串号', info.Imei],
  ['型号号码', `${info.ModelNumber} ${info.RegionInfo}`],
  ['系统版本', `${info.ProductVersion} (${info.BuildVersion})`],
  ['产品类型', `${info.ProductType}`],
  ['主板序号', info.MLBSerialNumber],
  ['ECID', info.Ecid],
  ['UDID', info.UniqueDeviceID],
  ['激活状态', info.ActivationState],
  ['网络锁', stripHtml(info.NetworkLock)],
  ['激活锁', stripHtml(info.ActivationLock)],
  ['保修期限', info.Warranty],
  ['销售地区', info.SalesRegion.chinese],
  ['iCloud备份', info.iCloud],
  ['CPU类型', info.CPU],
])

export function getPrintPayload(device: DeviceMapItem) {
  const { info, memory, product, battery, summary } = device
  return {
    DeviceName           : product.Name,
    Imei                 : summary.Imei,
    SerialNumber         : summary.SerialNumber,
    MLBSerialNumber      : info.MLBSerialNumber,
    ProductVersion       : info.ProductVersion,
    ModelNumber          : info.ModelNumber,
    RegionInfo           : info.RegionInfo,
    Color                : product.Color,
    CycleCount           : battery.CycleCount,
    DesignCapacity       : battery.DesignCapacity,
    TotalDiskCapacity    : memory.TotalDiskCapacity,
    NominalChargeCapacity: battery.NominalChargeCapacity,
    NetworkLock          : stripHtml(summary.NetworkLock),
    ActivationLock       : stripHtml(summary.ActivationLock),
    Warranty             : summary.Warranty,
  }
}
