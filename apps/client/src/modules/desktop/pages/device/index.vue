<script setup lang="ts">
import DeviceList       from './views/DeviceList.vue'
import DeviceDetail     from './views/DeviceDetail.vue'
import WaitConnect      from './views/WaitConnect.vue'
import PluginDownload   from './views/PluginDownload.vue'

import type { DeviceStore } from './utils'
import type { BatteryInfo, DeviceInfo, MemoryInfo, ProductData, ProductInfo, DeviceResponse, SalesRegion } from './types'
import { STORE, getDeviceForm } from './utils'
import { ws, wsFetch } from './utils/websocket'
import http from '@/utils/http'

const store: DeviceStore = reactive({
  deviceMap: new Map(),
  status: 'wait',
  screenshot: '',
  selected: '',
})

provide(STORE, store)

const [datasets, countriesMap] = await Promise.all([
  fetch('/devices-ios.json').then(res => res.json()),
  fetch('/sales-region.json').then(res => res.json()),
]) as [ProductData, Record<string, string[]>]

watch(
  ws.data,
  async (value: string) => {
    if (value.startsWith('disconnected')) {
      return handleDisconnect(value)
    }

    if (value.startsWith('{"id"')) return
    if (value.includes('DeviceID')) {
      const data = JSON.parse(value)
      await handleDevice(data)

      if (store.deviceMap.size === 1) {
        store.status = 'list'
      }
    }
  },
)

await checkPlugin()
async function checkPlugin() {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 3000)

  try {
    const response = await fetch(
      'http://localhost:9999/info',
      { signal: controller.signal },
    )

    const { data } = await response.json()
    await handleInfo(data)
  }
  catch (error) {
    try {
      const data = await wsFetch({ type: 'info' })
      await handleInfo(data as DeviceResponse[])
    }
    catch (error) {
      console.warn(error)
      store.status = 'plugin'
    }
  }
}

watch(
  () => store.selected,
  (value) => {
    if (!value) return
    const [, uniqueId] = value.split(':')
    store.screenshot = ''
    getScreenshot(uniqueId)
  },
)

async function handleInfo(data: DeviceResponse[]) {
  if (!data || data.length === 0) return
  await Promise.all(data.map(handleDevice))
  store.status = 'list'
}

async function handleDevice(data: DeviceResponse) {
  const { DeviceInfo, Memory, ICloud, DeviceID } = data
  const product = getProduct(DeviceInfo)
  const form = getDeviceForm(data, product)
  const battery = await getBatteryInfo(DeviceInfo)
  const cache = await getPrevCache(form.Imei)
  const SalesRegion = getSalesRegion(form.RegionInfo)
  const key = `${DeviceID}:${DeviceInfo.UniqueDeviceID}`

  http.post('/device/save', data)
  store.deviceMap.set(key, {
    DeviceID : DeviceID,
    icloud   : ICloud,
    product  : product,
    info     : DeviceInfo,
    battery  : battery as BatteryInfo,
    memory   : Memory as MemoryInfo,
    form     : { ...form, ...cache, SalesRegion },
    cache    : {
      hasNetworkLock: cache.NetworkLock !== '--',
      hasActivationLock: cache.ActivationLock !== '--',
      hasWarranty: cache.Warranty !== '--',
    },
  })
}

function getProduct(data: DeviceInfo) {
  type ProductKey = keyof typeof datasets

  let product = null
  if (data.ProductType in datasets) {
    product = datasets[data.ProductType as ProductKey] as ProductInfo
    if (Array.isArray(product)) product = product[0]  
  }

  let color = '未知颜色'
  if (data.DeviceColor in product) {
    color = product[data.DeviceColor]
  }
  else if (data.SerialNumber.length === 12) {
    const suffix = data.SerialNumber.slice(-4)
    color = datasets[suffix as ProductKey] as string
  }

  return {
    Name: product ? product.Name : data.ProductType,
    Chip: product ? product.Chip : data.CPUArchitecture,
    Color: color,
  }
}

/**
 * 根据型号代码获取销售地区信息
 * @param modelCode 型号代码，如 "LL/A"
 * @returns 销售地区信息，包含中文和英文描述
 */
 function getSalesRegion(modelCode: string): SalesRegion {
  for (const pattern in countriesMap) {
    const regex = new RegExp(pattern)
    
    if (regex.test(modelCode)) {
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

function handleDisconnect(value: string) {
  const deviceId = value.split(':')[1]

  for (const key of store.deviceMap.keys()) {
    const keyPrefix = key.split(':')[0]
    if (keyPrefix === deviceId) {
      store.deviceMap.delete(key)
    }
  }

  if (store.deviceMap.size === 0) {
    store.status = 'wait'
  }
}

async function getPrevCache(imei: string) {
  const { data } = await http.post(
    '/device/prev-query',
    {
      networkLockId: 1160,
      activationLockId: 1161,
      warrantyId: 1162,
      imei: imei,
    },
  )

  return {
    NetworkLock: data.networkLockCode || '--',
    ActivationLock: data.activationLockCode || '--',
    Warranty: data.warrantyCode || '--',
  }
}

async function getBatteryInfo(device: DeviceInfo) {
  return await wsFetch<BatteryInfo>({
    Uid: device.UniqueDeviceID,
    type: 'battery',
  })
}

async function getScreenshot(id: string) {
  const response = await wsFetch<string>({
    type: 'screenshot',
    Uid: id,
  })

  store.screenshot = `data:image/png;base64,${response}`
}

const components = {
  list: DeviceList,
  wait: WaitConnect,
  detail: DeviceDetail,
  plugin: PluginDownload,
}
</script>

<template>
  <div class="p-4 h-full">
    <Transition name="fade-in" mode="out-in">
      <component :is="components[store.status]" />
    </Transition>
  </div>
</template>
