import { maskText } from "@/utils"
import type { DeviceForm, ProductItem, Device, DeviceResponse } from "../types"
import type { IK } from "@3un/shared"

import { stripHtml } from '@3un/utils'

type DeviceStatus = 'list' | 'detail' | 'wait' | 'plugin' | 'version'

export interface DeviceStore {
  deviceMap    : Map<string, Device>
  status       : DeviceStatus
  visiblePrint : boolean
  printIndex   : string
  screenshot   : string
  selected     : string
  hasNewVersion: boolean
}

export const STORE: IK<DeviceStore> = Symbol('device')

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

export function getPrintPayload(device: Device) {
  const { info, memory, product, battery, form } = device
  return {
    DeviceName: product.Name,
    Color: product.Color,
    Imei: form.Imei,
    SerialNumber: form.SerialNumber,
    MLBSerialNumber: info.MLBSerialNumber,
    ProductVersion: info.ProductVersion,
    RegionInfo: info.RegionInfo,
    ModelNumber: info.ModelNumber,
    TotalDiskCapacity: memory.TotalDiskCapacity,
    NominalChargeCapacity: battery.NominalChargeCapacity,
    DesignCapacity: battery.DesignCapacity,
    CycleCount: battery.CycleCount,
    NetworkLock: stripHtml(form.NetworkLock),
    ActivationLock: stripHtml(form.ActivationLock),
    Warranty: form.Warranty,
  }
}

export function getDeviceForm(device: DeviceResponse, product: ProductItem) {
  const { DeviceInfo, ICloud } = device
  return {
    ModelNumber: DeviceInfo.ModelNumber,
    SerialNumber: DeviceInfo.SerialNumber,
    MLBSerialNumber: DeviceInfo.MLBSerialNumber,
    Imei: DeviceInfo.InternationalMobileEquipmentIdentity,
    ProductType: `${DeviceInfo.ProductType} (${product.ModelNumber})`,
    ProductVersion: DeviceInfo.ProductVersion,
    BuildVersion: DeviceInfo.BuildVersion,
    RegionInfo: DeviceInfo.RegionInfo,
    Ecid: DeviceInfo.Ecid.toUpperCase(),
    WiFiAddress: maskText(DeviceInfo.WiFiAddress, 9, 11),
    UniqueDeviceID: DeviceInfo.UniqueDeviceID,
    iCloud: ICloud.CloudBackupEnabled ? '已开启' : '未开启',
    ActivationState: DeviceInfo.ActivationState ? '已激活' : '未激活',
    CPU: product.Chip || '--',
    Warranty: '--',
    NetworkLock: '--',
    ActivationLock: '--',
  }
}
