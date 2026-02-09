import type { BatteryResponse, DeviceBaseInfo, DeviceMapItem, DeviceProduct, DeviceResponse, ProductDataset, ProductItem, SaleRegion, SaleRegionDataset } from "@/types/device"
import { maskText } from "@/utils"
import http from "@/utils/http"
import { useWebSocket } from "@vueuse/core"
import { toast } from "vue-sonner"

type WebSocketType =
  | 'info'
  | 'battery'
  | 'screenshot'
  | 'print'
  | 'activation'
  | 'deactivate'
  | 'enterRecoveryMode'
  | 'exitRecoveryMode'
  | 'reboot'
  | 'shutdown'
  | 'mountImage'

interface WebSocketParams {
  type                   : WebSocketType

  Uid                   ?: string
  DeviceName            ?: string
  ModelNumber           ?: string
  MLBSerialNumber       ?: string
  Imei                  ?: string
  Color                 ?: string
  CycleCount            ?: number
  RegionInfo            ?: string
  ProductVersion        ?: string
  TotalDiskCapacity     ?: number
  NominalChargeCapacity ?: number
  DesignCapacity        ?: number
  TemplateId            ?: number
}

interface WebSocketHandler {
  resolve: (data: any) => void
  reject: (data: any) => void
}

const [datasets, countriesMap] = await Promise.all([
  fetch('/data/devices-ios.json').then(res => res.json()),
  fetch('/data/sales-region.json').then(res => res.json()),
]) as [ProductDataset, SaleRegionDataset]

export const deviceMap = reactive<Map<string, DeviceMapItem>>(new Map<string, DeviceMapItem>)

export const messageHandlers = new Map<string, WebSocketHandler>()

export const ws = useWebSocket(
  'ws://localhost:10000/ws',
  {
    autoReconnect: {
      delay: 2000,
      retries: 3,
    },
    heartbeat: {
      interval: 30000,
      pongTimeout: 3000,
      responseMessage: 'pong',
    },
    onMessage: (_, event) => {
      if (!event.data.startsWith('{"id"')) return

      const response = JSON.parse(event.data)
      const handler = messageHandlers.get(response.id)
      if (!handler) return

      if (response.code === 200) {
        handler.resolve(response.data)
      }
      else {
        toast.warning(response.message)
        handler.reject(new Error(response.message))
      }

      messageHandlers.delete(response.id)
    }
  }
)

export async function checkPlugin(t: (str: string) => string) {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 3000)

  try {
    const response = await fetch(
      'http://localhost:9999/info',
      {
        signal: controller.signal,
        headers: {'x-token': Date.now().toString(16)},
      },
    )

    const { data } = await response.json()

    await handleInfo(data, t)
  }
  catch (error) {
    try {
      const data = await wsFetch({ type: 'info' })
      await handleInfo(data as DeviceResponse[], t)
    }
    catch (error) {
      console.warn(error)
    }
  }
}

export function handleDisconnect(value: string) {
  const deviceId = value.split(':')[1]

  for (const key of deviceMap.keys()) {
    const keyPrefix = key.split(':')[0]
    if (keyPrefix === deviceId) {
      deviceMap.delete(key)
    }
  }
}

async function handleInfo(data: DeviceResponse[], t: (str: string) => string) {
  if (!data || data.length === 0) return

  for (let item of data) {
    await handleDevice(item, t)
  }
}

export async function handleDevice(data: DeviceResponse, t: (str: string) => string) {
  const { DeviceInfo, Memory, ICloud, DeviceID } = data
  const key = `${DeviceID}:${DeviceInfo.UniqueDeviceID}`
  // const imei = DeviceInfo.InternationalMobileEquipmentIdentity

  const product = getProduct(DeviceInfo, t)
  const battery = await getBatteryInfo(DeviceInfo)

  const summary = handleSummary(data, product, t)

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
  // const deviceMap: Record<string, DeviceMapItem> = {}

  // deviceMap[key] = {
  //   deviceId : DeviceID,
  //   product  : product,
  //   battery  : battery,
  //   memory   : Memory,
  //   icloud   : ICloud,
  //   info     : DeviceInfo,
  //   summary  : summary,
  // }
}

function wsFetch<T>(params: WebSocketParams) {
  return new Promise<T>((resolve, reject) => {
    if (ws.status.value !== 'OPEN') {
      reject(new Error('WebSocket is not connected'))
      return
    }

    const id = getRequestId()
    ws.send(JSON.stringify({ ...params, id }))
    messageHandlers.set(id, { resolve, reject })
  })
}

function getRequestId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 9)
}

function getProduct(data: DeviceBaseInfo, t: (str: string) => string) {
  type ProductKey = keyof typeof datasets

  let product = null
  if (data.ProductType in datasets) {
    product = datasets[data.ProductType as ProductKey] as ProductItem
    if (Array.isArray(product)) product = product[0]  
  }

  let color = t('device.info.color.unknown')
  if (data.DeviceColor in product) {
    color = product[data.DeviceColor]
  }
  else if (data.SerialNumber.length === 12) {
    const suffix = data.SerialNumber.slice(-4)
    color = datasets[suffix as ProductKey] as string
  }

  let modelNumber = ''
  let imeiPrefix = data.InternationalMobileEquipmentIdentity.slice(0, 8)

  if (imeiPrefix in product) {
    modelNumber = product[imeiPrefix as ProductKey] as string
  }

  return {
    Name: product ? product.Name : data.ProductType,
    Chip: product ? product.Chip : data.CPUArchitecture,
    ModelNumber: modelNumber || t('unknown'),
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
  t: (str: string) => string,
) {
  const { DeviceInfo: info, ICloud } = device
  const salesRegion = getSalesRegion(info.RegionInfo, t)

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
    ActivationState : info.ActivationState ? t('device.info.grid.actived.already') : t('device.info.grid.actived.not'),
    iCloud          : ICloud.CloudBackupEnabled ? t('device.info.grid.open.already') : t('device.info.grid.open.not'),
    CPU             : product.Chip || '--',
    SalesRegion     : salesRegion,

    // Warranty        : cache.warrantyCode || '--',
    // NetworkLock     : cache.networkLockCode || '--',
    // ActivationLock  : cache.activationLockCode || '--',
  }
}

function getSalesRegion(regionInfo: string, t: (str: string) => string,): SaleRegion {
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
    chinese: t('unknown'),
    english: 'Unknown'
  }
}
