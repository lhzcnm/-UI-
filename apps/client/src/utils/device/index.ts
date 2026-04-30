import { orderApi } from '@/api/orders'
import {
  type BatteryResponse,
  type DeviceBaseInfo,
  type DeviceMapItem,
  type DeviceProduct,
  type DeviceRecoveryData,
  type DeviceRecoveryMapItem,
  type DeviceResponse,
  type LanguageItem,
  type ProductDataset,
  type ProductItem,
  type SaleRegion,
  type SaleRegionDataset
} from '@/types/device'
import http from '../http'
import { wsFetch } from './websocket'
import { maskText } from '../common'
import { getLanuagestring } from '../constant'

interface VersionResp {
  latest: string,
  lowest: string,
}

const { isEn } = useSystemStore()

let datasetsPromise: Promise<[ProductDataset, SaleRegionDataset]> | null = null
let datasets: ProductDataset, countriesMap: SaleRegionDataset

let versionPromise: Promise<VersionResp>
let latest: string, lowest: string

export async function setDataSets() {
  const data = await getDatasets()
  datasets = data[0]
  countriesMap = data[1]
}

export async function setVersion() {
  const data = await getVersionPromise()
  latest = data.latest
  lowest = data.lowest
}

export function handleDisconnect(value: string, deviceMap: Map<string, DeviceMapItem>) {
  const deviceId = value.split(':')[1]

  for (const key of deviceMap.keys()) {
    const keyPrefix = key.split(':')[0]
    if (keyPrefix === deviceId) {
      deviceMap.delete(key)
    }
  }

  return deviceMap
}

export async function handleDevice(data: DeviceResponse, deviceMap: Map<string, DeviceMapItem>) {
  const { DeviceInfo, Memory, ICloud, DeviceID } = data
  const key = `${DeviceID}:${DeviceInfo.UniqueDeviceID}`

  const product = getProduct(DeviceInfo)
  const battery = await getBatteryInfo(DeviceInfo)

  const summary = handleSummary(data, product)

  http.post('/device/save', data)

  deviceMap.set(key, {
    deviceId : DeviceID,
    product  : product,
    battery  : battery,
    memory   : Memory,
    icloud   : ICloud,
    info     : DeviceInfo,
    summary  : summary,
  })

  return deviceMap
}

export function processRecoveryDevice(device: DeviceRecoveryData): DeviceRecoveryMapItem {
  return {
    name: device.NAME,
    type: device.PRODUCT,
    model: device.MODEL,
    mode: device.MODE,

    serialNo: device.SRNM,
    ecid: device.ECID,
    imei: device.IMEI,

    chip: device.CPID,
    boardId: device.BDID,
    chipRev: device.CPRV,

    apNonce: device.NONC,
    sepNonce: device.SNON,
    sep: device.SCEP,

    ibootFlag: device.IBFL,
    srtg: device.SRTG
  }
}

export function checkVersion(version: string = '1.0.0') {
  return version < lowest
}

export function hasNewVersion(version: string = '1.0.0') {
  return version < latest
}

export async function handleInfo(data: DeviceResponse[]) {
  if (!data || data.length === 0) return new Map()

  let deviceMap: Map<string, DeviceMapItem> = new Map()
  for (const device of data) {
    deviceMap = await handleDevice(device, deviceMap)
  }

  return deviceMap
}

function getDatasets() {
  if (!datasetsPromise) {
    datasetsPromise = Promise.all([
      getDeviceJson(),
      getSalesRegionJson(),
    ]) as Promise<[ProductDataset, SaleRegionDataset]>
  }
  return datasetsPromise
}

function getVersionPromise() {
  if (!versionPromise) {
    versionPromise = getVersion()
  }

  return versionPromise
}

async function getDeviceJson() {
  const { data } = await orderApi.devices()
  return JSON.parse(data)
}

async function getSalesRegionJson() {
  const { data } = await orderApi.salesRegion()
  return JSON.parse(data)
}

async function getVersion(): Promise<VersionResp> {
  const response = await fetch('/data/version.json')
  const { latest, lowest } = await response.json()
  return { latest, lowest }
}

function isLangText(val: any): val is LanguageItem {
  return val && typeof val === 'object' && 'ch' in val && 'en' in val
}

function getProduct(data: DeviceBaseInfo) {
  type ProductKey = keyof typeof datasets

  let product = null
  const langKey = isEn ? 'en' : 'ch'
  if (data.ProductType in datasets) {
    product = datasets[data.ProductType as ProductKey] as ProductItem
    if (Array.isArray(product)) product = product[0]  
  }

  let color = getLanuagestring('unknown_color', isEn ? 'en' : 'zh')

  if (data.ModelNumber in datasets) {
    const dataSet = datasets[data.ModelNumber]
    if (isLangText(dataSet)) {
      color = dataSet[langKey] as string
    }
  }
  else if (product && data.ModelNumber in product) {
    color = product[data.ModelNumber][langKey]
  }
  else if (data.SerialNumber.length === 12) {
    const suffix = data.SerialNumber.slice(-4)
    let rawColor = datasets[suffix as ProductKey]

    if (typeof rawColor === 'string') {
      color = rawColor as string
    } else if (isLangText(rawColor)) {
      color = rawColor[langKey] as string
    }
  }

  let chip: string | null = null
  if (isLangText(product.Chip)) {
    chip = product.Chip[langKey]
  }

  let modelNumber = ''
  let imeiPrefix = data.InternationalMobileEquipmentIdentity.slice(0, 8)

  if (product && imeiPrefix in product) {
    modelNumber = product[imeiPrefix as ProductKey] as string
  }

  return {
    Name: product ? product.Name : data.ProductType,
    Chip: product ? chip ? chip : data.CPUArchitecture : data.CPUArchitecture,
    ModelNumber: modelNumber || getLanuagestring('unknown', isEn ? 'en' : 'zh'),
    Color: color,
  }
}

async function getBatteryInfo(device: DeviceBaseInfo) {
  return await wsFetch<BatteryResponse>({
    Uid: device.UniqueDeviceID,
    type: 'battery',
  })
}

function handleSummary(
  device: DeviceResponse,
  product: DeviceProduct,
) {
  const { DeviceInfo: info, ICloud } = device
  const salesRegion = getSalesRegion(info.RegionInfo)

  return {
    ModelNumber     : info.ModelNumber,
    SerialNumber    : info.SerialNumber,
    MLBSerialNumber : info.MLBSerialNumber,
    Imei            : info.InternationalMobileEquipmentIdentity,
    ProductType     : `${info.ProductType} (${product.ModelNumber})`,
    ProductVersion  : info.ProductVersion,
    BuildVersion    : info.BuildVersion,
    RegionInfo      : info.RegionInfo,
    UniqueDeviceID  : info.UniqueDeviceID,
    Ecid            : info.Ecid.toUpperCase(),
    WiFiAddress     : maskText(info.WiFiAddress, 9, 11),
    ActivationState : info.ActivationState,
    iCloud          : ICloud.CloudBackupEnabled
      ? getLanuagestring('device_icloud_enable', isEn ? 'en' : 'zh')
      : getLanuagestring('device_icloud_disable', isEn ? 'en' : 'zh'),
    CPU             : product.Chip || '--',
    SalesRegion     : salesRegion,
  }
}

function getSalesRegion(regionInfo: string): SaleRegion {
  for (const pattern in countriesMap) {
    const regex = new RegExp(pattern)
    
    if (regex.test(regionInfo)) {
      const regions = countriesMap[pattern]
      return {
        chinese: regions[0],
        english: regions[1],
      }
    }
  }

  return {
    chinese: '未知',
    english: 'Unknown'
  }
}
