<script setup lang="ts">
import DeviceList       from './views/DeviceList.vue'
import DeviceDetail     from './views/DeviceDetail.vue'
import WaitConnect      from './views/WaitConnect.vue'
import PluginDownload   from './views/PluginDownload.vue'

import type { DeviceStore } from './utils'
import type { BatteryInfo, DeviceInfo, MemoryInfo, ProductData, ProductInfo, DeviceResponse } from './types'
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

const r = await fetch('/devices-ios.json')
const datasets = await r.json() as ProductData

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
  const battery = await getBatteryInfo(DeviceInfo)
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
  <div class="relative p-4 h-full">
    <Transition name="fade-in" mode="out-in">
      <component :is="components[store.status]" />
    </Transition>
  </div>
</template>
