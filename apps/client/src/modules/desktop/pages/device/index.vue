<script setup lang="ts">
import DeviceList from './views/DeviceList.vue'
import DeviceDetail from './views/DeviceDetail.vue'
import WaitConnect from './views/WaitConnect.vue'
import PluginDownload from './views/PluginDownload.vue'

import { useWebSocket } from '@vueuse/core'

import type { DeviceStore } from './utils'
import type { BatteryInfo, DeviceInfo, MemoryInfo, ProductData, ProductInfo, ProductItem, DeviceResponse } from './types'
import { DEVICE_STORE, DEVICE_CONFIG, getDeviceForm } from './utils'
import http from '@/utils/http'

const store: DeviceStore = reactive({
  deviceMap: new Map(),
  status: 'wait',
  screenshot: '',
  selected: '',
})

provide(DEVICE_STORE, store)

const r = await fetch('/devices-ios.json')
const datasets = await r.json() as ProductData

await checkPlugin()
async function checkPlugin() {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 5000)

  try {
    const response = await fetch(
      `${DEVICE_CONFIG.api}/info`,
      { signal: controller.signal },
    )

    const { data } = await response.json()
    if (!data || data.length === 0) return
    await Promise.all(data.map(handleDevice))
    store.status = 'list'
  }
  catch (error) {
    console.warn(error)
    store.status = 'plugin'
  }
}

const { data } = useWebSocket(
  DEVICE_CONFIG.ws,
  {
    heartbeat: {
      interval: 30000,
      pongTimeout: 3000,
      responseMessage: 'pong',
    },
  },
)

watch(data, async (value) => {
  if (value.startsWith('disconnected:')) {
    return handleDisconnect(value)
  }

  const data = JSON.parse(value)
  await handleDevice(data)

  if (store.deviceMap.size === 1) {
    store.status = 'list'
  }
})

watch(
  () => store.selected,
  (value) => {
    if (!value) return
    const [, uniqueId] = value.split(':')
    getScreenshot(uniqueId)
  },
)

async function handleDevice(data: DeviceResponse) {
  const { DeviceInfo, Memory, ICloud, DeviceID } = data
  const product = getProduct(DeviceInfo)
  const battery = await getBatteryInfo(DeviceInfo, product)
  const key = `${DeviceID}:${DeviceInfo.UniqueDeviceID}`

  http.post('/device/save', data)
  store.deviceMap.set(key, {
    DeviceID: DeviceID,
    form: getDeviceForm(data, product),
    battery: battery as BatteryInfo,
    memory: Memory as MemoryInfo,
    icloud: ICloud,
    product: product,
    info: DeviceInfo,
  })
}

function getProduct(data: DeviceInfo) {
  type ProductKey = keyof typeof datasets

  let product = null
  if (data.ProductType in datasets) {
    product = datasets[data.ProductType as ProductKey] as ProductInfo
    if (Array.isArray(product)) product = product[0]  
  }

  let color = data.DeviceColor
  if (data.DeviceColor in product) {
    color = product[data.DeviceColor]
  }
  else if (data.ModelNumber.length === 12) {
    const suffix = data.ModelNumber.slice(-4)
    color = datasets[suffix as ProductKey] as string
  }

  return {
    Name: product ? product.Name : data.ProductType,
    Chip: product ? product.Chip : data.CPUArchitecture,
    Color: color,
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

async function getBatteryInfo(
  device: DeviceInfo, 
  product: ProductItem
) {
  const response = await fetch(
    `${DEVICE_CONFIG.api}/battery`,
    {
      method: 'POST',
      body: JSON.stringify({
        ProductName: product.Name,
        UniqueId: device.UniqueDeviceID,
      }),
    },
  )

  return (await response.json()).data
}

async function getScreenshot(id: string) {
  const response = await fetch(`${DEVICE_CONFIG.api}/screenshot/${id}`)
  const blob = await response.blob()
  store.screenshot = URL.createObjectURL(blob)
}

const components = {
  list: DeviceList,
  detail: DeviceDetail,
  wait: WaitConnect,
  plugin: PluginDownload,
}
</script>

<template>
  <div class="relative p-4 h-full">
    <Transition name="fade-in" mode="out-in">
      <component :is="components[store.status]" />
    </Transition>
  </div>
</template>
