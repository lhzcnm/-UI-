<script setup lang="ts">
import DeviceList     from './views/DeviceList.vue'
import DeviceDetail   from './views/DeviceDetail.vue'
import WaitConnect    from './views/WaitConnect.vue'
import PluginMissing  from './views/PluginMissing.vue'
import PluginVersion  from './views/PluginVersion.vue'
import PrintDialog    from './components/PrintDialog.vue'
import Preview        from './views/Preview.vue'

import http from '@/utils/http'
import { maskText } from '@/utils'

import type {
  DeviceStore,
} from './types'

import { ws, wsFetch, STORE } from './utils'
import type {
  BatteryResponse,
  DeviceBaseInfo,
  DeviceProduct,
  DeviceRecoveryData,
  DeviceRecoveryMapItem,
  DeviceResponse,
  ProductDataset,
  ProductItem,
  SaleRegion,
  SaleRegionDataset
} from '@/types/device'
import { orderApi } from '@/api/orders'

const store: DeviceStore = reactive({
  deviceMap        : new Map(),
  recoverDeviceMap : new Map(),
  visiblePrint     : false,
  hasNewVersion    : false,
  deviceStatus     : 'wait',
  prevStatus       : 'wait',
  screenshotStatus : 'wait',
  printIndex       : '',
  screenshot       : '',
  selected         : '',
  queryServices    : [],
})

provide(STORE, store)

const [datasets, countriesMap] = await Promise.all([
  // fetch('/data/devices-ios.json').then(res => res.json()),
  // fetch('/data/sales-region.json').then(res => res.json()),
  getDeviceJson(),
  getSalesRegionJson(),
]) as [ProductDataset, SaleRegionDataset]

const version = ref('')

const { t } = useI18n()
const { getServices } = useServiceStore()

watch(
  ws.data,
  async (value: string) => {
    if (value.startsWith('disconnected')) {
      if (await checkVersion(version.value)) {
        return store.deviceStatus = 'version'
      }
      if (value.includes('Recovery')) {
        const match = value.match(/0x[0-9a-fA-F]+/)

        if (match) {
          store.recoverDeviceMap.delete(match[0])
        }
        return
      }

      return handleDisconnect(value)
    }

    const data = JSON.parse(value) as any

    if (data.type === 'recovery_attached') {
      const rawData = data.data as DeviceRecoveryData
      store.recoverDeviceMap.set(rawData.ECID, processRecoveryDevice(rawData))
      return
    }

    if (value.startsWith('{"id"')) return
    if (value.includes('DeviceID')) {
      const rawData = data as DeviceResponse
      if (await checkVersion(rawData.Version)) {
        version.value = rawData.Version
        return store.deviceStatus = 'version'
      }

      await handleDevice(data)

      if (store.deviceMap.size === 1) {
        store.deviceStatus = 'list'
      }
    }
  },
)

watch(
  () => store.selected,
  (value) => {
    if (!value) return
    store.screenshot = ''

    const [, uniqueId] = value.split(':')
    checkScreenshot(uniqueId)
  },
)

function handleDisconnect(value: string) {
  const deviceId = value.split(':')[1]

  for (const key of store.deviceMap.keys()) {
    const keyPrefix = key.split(':')[0]
    if (keyPrefix === deviceId) {
      store.deviceMap.delete(key)
    }
  }

  if (store.deviceMap.size === 0 && store.recoverDeviceMap.size === 0) {
    store.deviceStatus = 'wait'
  }
}

async function checkPlugin() {
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
    
    await handleInfo(data)
  }
  catch (error) {
    // console.log(error)
    try {
      const data = await wsFetch({ type: 'info' })
      await handleInfo(data as DeviceResponse[])
    }
    catch (error) {
      console.warn(error)
      store.deviceStatus = 'plugin'
    }
  }
}

async function getRecovery() {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 3000)

  try {
    const response = await fetch(
      'http://localhost:9999/info/recovery',
      {
        signal: controller.signal,
        headers: { 'x-token': Date.now().toString(16) },
      },
    )
    
    const { data }: { data: DeviceRecoveryData[] } = await response.json()

    if (!data || data.length === 0) return

    for (let device of data) {
      const recoveryDevice = processRecoveryDevice(device)
      store.recoverDeviceMap.set(device.ECID, recoveryDevice)
    }
  } catch(err) {
    console.warn(err)
    try {
      const data: { devices: DeviceRecoveryData[] } = await wsFetch({ type: 'recoveryInfo' })

      if (!data.devices || data.devices.length === 0) return
      
      for (let device of data.devices) {
        const recoveryDevice = processRecoveryDevice(device)
        store.recoverDeviceMap.set(device.ECID, recoveryDevice)
      }
      // console.log(store.recoverDeviceMap)
    } catch(err) {
      console.error(err)
    }
  } finally {
    if (store.recoverDeviceMap.size > 0) {
      store.deviceStatus = 'list'
    }
  }
}

await checkPlugin()
await getRecovery()

async function handleInfo(data: DeviceResponse[]) {
  if (!data || data.length === 0) return
  version.value = data[0].Version
  if (await checkVersion(version.value)) {
    return store.deviceStatus = 'version'
  }

  await Promise.all(data.map(handleDevice))
  store.deviceStatus = 'list'
}

async function checkVersion(version: string = '1.0.0') {
  const response = await fetch('/data/version.json')
  const { latest, lowest } = await response.json()
  store.hasNewVersion = version < latest

  return version < lowest
}

async function handleDevice(data: DeviceResponse) {
  const { DeviceInfo, Memory, ICloud, DeviceID } = data
  const key = `${DeviceID}:${DeviceInfo.UniqueDeviceID}`
  // const imei = DeviceInfo.InternationalMobileEquipmentIdentity

  const product = getProduct(DeviceInfo)
  const battery = await getBatteryInfo(DeviceInfo)
  // const cache   = await getPrevCache(imei)

  const summary = handleSummary(data, product)
  // const cacheStatus = getDeviceCacheStatus(cache)

  http.post('/device/save', data)

  store.deviceMap.set(key, {
    deviceId : DeviceID,
    product  : product,
    battery  : battery,
    memory   : Memory,
    icloud   : ICloud,
    info     : DeviceInfo,
    // cache    : cacheStatus,
    summary  : summary,
  })
}

function getProduct(data: DeviceBaseInfo) {
  type ProductKey = keyof typeof datasets

  let product = null

  if (data.ProductType in datasets) {
    product = datasets[data.ProductType as ProductKey] as ProductItem
    if (Array.isArray(product)) product = product[0]  
  }

  let color = t('device.info.color.unknown')

  if (data.DeviceColor in product) {
    color = product[data.DeviceColor]
  } else if (data.SerialNumber.length === 12) {
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
    chinese: t('unknown'),
    english: 'Unknown'
  }
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
    ActivationState : info.ActivationState ? t('device.info.grid.actived.already') : t('device.info.grid.actived.not'),
    iCloud          : ICloud.CloudBackupEnabled ? t('device.info.grid.open.already') : t('device.info.grid.open.not'),
    CPU             : product.Chip || '--',
    SalesRegion     : salesRegion,

    // Warranty        : cache.warrantyCode || '--',
    // NetworkLock     : cache.networkLockCode || '--',
    // ActivationLock  : cache.activationLockCode || '--',
  }
}

// async function getPrevCache(imei: string) {
//   const { data } = await http.post<DeviceCache>(
//     '/device/prev-query',
//     {
//       networkLockId: 1160,
//       activationLockId: 1161,
//       warrantyId: 1162,
//       imei: imei,
//     },
//   )

//   return data
// }

// function getDeviceCacheStatus(cache: DeviceCache) {
//   const hasNetworkLock = cache.networkLockCode !== '--'
//   const hasActivationLock = cache.activationLockCode !== '--'
//   const hasWarranty = cache.warrantyCode !== '--'

//   return {
//     hasNetworkLock: hasNetworkLock,
//     hasActivationLock: hasActivationLock,
//     hasWarranty: hasWarranty,

//     showNetworkLock: !hasNetworkLock,
//     showActivationLock: !hasActivationLock,
//     showWarranty: !hasWarranty,
//   }
// }

async function getBatteryInfo(device: DeviceBaseInfo) {
  return await wsFetch<BatteryResponse>({
    Uid: device.UniqueDeviceID,
    type: 'battery',
  })
}

async function getScreenshot(id: string) {
  const data = await wsFetch<string>({
    type: 'screenshot',
    Uid: id,
  })

  if (data === 'failed') store.screenshot = ''
  else store.screenshot = `data:image/png;base64,${data}`
}

async function checkScreenshot(id: string) {
  const data = await wsFetch<string>({
    type: 'mountImage',
    Uid: id,
  })

  const isSuccess = data.endsWith('success')
  const status = isSuccess ? 'success' : 'fail'

  if (isSuccess) await getScreenshot(id)
  store.screenshotStatus = status
}

function processRecoveryDevice(device: DeviceRecoveryData): DeviceRecoveryMapItem {
  return {
    name: device.NAME,
    type: device.PRODUCT,
    serialNo: device.SRNM,
    ecid: device.ECID,
    chip: device.CPID,
    mode: device.MODE,
  }
}

async function getDeviceJson() {
  const { data } = await orderApi.devices()
  return JSON.parse(data)
}

async function getSalesRegionJson() {
  const { data } = await orderApi.salesRegion()
  return JSON.parse(data)
}

await Promise.all([
  getServices(),
  // getDeviceJson(),
  // getSalesRegionJson(),
])

const components = {
  list: DeviceList,
  wait: WaitConnect,
  detail: DeviceDetail,
  plugin: PluginMissing,
  version: PluginVersion,
  printView: Preview,
}
</script>

<template>
  <div class="p-4 h-full">
    <Transition name="fade-in" mode="out-in">
      <component :is="components[store.deviceStatus]" />
    </Transition>

    <PrintDialog />
  </div>
</template>
