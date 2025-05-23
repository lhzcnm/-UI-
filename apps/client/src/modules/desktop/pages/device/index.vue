<script setup lang="ts">
import DevicePhoneDisplay from './components/DevicePhoneDisplay.vue'
import DeviceInfoHeader from './components/DeviceInfoHeader.vue'
import DeviceInfoGrid from './components/DeviceInfoGrid.vue'
import DeviceBatteryInfo from './components/DeviceBatteryInfo.vue'
import DeviceDiskInfo from './components/DeviceDiskInfo.vue'
import WaitConnect from './components/WaitConnect.vue'
import PluginDownload from './components/PluginDownload.vue'

import { useWebSocket } from '@vueuse/core'

import type { DeviceStore } from './utils'
import type { BatteryInfo, DeviceInfo, Product, ProductData } from './types'
import { DEVICE_STORE, ConnStatus, DEVICE_CONFIG } from './utils'
import DEVICE_DATA from '@/assets/devices-ios.json'
import http from '@/utils/http'

const store: DeviceStore = reactive({
  battery: {} as BatteryInfo,
  deviceMap: new Map(),
  productMap: new Map(),
  infoMap: new Map(),

  screenshot: '',
  selectedDevice: '',
  status: ConnStatus.IDLE,
})

provide(DEVICE_STORE, store)

await checkPlugin()

const visible = computed(() => ({
  waiting: store.status === ConnStatus.IDLE
    || store.status === ConnStatus.DISCONNECTED,
  plugin: store.status === ConnStatus.PLUGIN_NOT_INSTALLED,
  connected: store.status === ConnStatus.CONNECTED,
}))

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

watch(data, (value) => {
  if (value.startsWith('disconnected:')) {
    handleDisconnect(value)
    return
  }

  const data = JSON.parse(value) as DeviceInfo
  const key = `${data.DeviceID}:${data.UniqueDeviceID}`

  const product = getProduct(data)
  store.productMap.set(key, product)
  store.deviceMap.set(key, data)
  store.infoMap.set(key, {
    ModelNumber: data.ModelNumber,
    SerialNumber: data.SerialNumber,
    MLBSerialNumber: data.MLBSerialNumber,
    Imei: data.InternationalMobileEquipmentIdentity,
    ProductVersion: data.ProductVersion,
    BuildVersion: data.BuildVersion,
    RegionInfo: data.RegionInfo,
    UniqueChipID: data.UniqueChipID.toString(),
    UniqueDeviceID: data.UniqueDeviceID,
    ActivationState: data.ActivationState ? '已激活' : '未激活',
    iCloud: data.CloudBackupEnabled ? '已开启' : '未开启',
    CPU: product.Chip || '--',
    Warranty: '--',
    NetworkLock: '--',
    ActivationLock: '--',
  })

  http.post('/device/save', data)
  if (store.deviceMap.size === 1) {
    store.status = ConnStatus.CONNECTED
    store.selectedDevice = key
  }
})

watch(
  () => store.selectedDevice,
  (value) => {
    if (!value) return
    const [, uniqueId] = value.split(':')
    getScreenshot(uniqueId)
    getBatteryInfo(uniqueId)
  },
)

async function checkPlugin() {
  try {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 2000)
    await fetch(DEVICE_CONFIG.api, {
      signal: controller.signal,
    })
  }
  catch (error) {
    store.status = ConnStatus.PLUGIN_NOT_INSTALLED
    console.error('Plugin not installed')
  }
}

async function getScreenshot(id: string) {
  const response = await fetch(`${DEVICE_CONFIG.api}/screenshot/${id}`)
  const blob = await response.blob()
  store.screenshot = URL.createObjectURL(blob)
}

async function getBatteryInfo(id: string) {
  const product = store.productMap.get(store.selectedDevice)!
  const response = await fetch(
    `${DEVICE_CONFIG.api}/battery`,
    {
      method: 'POST',
      body: JSON.stringify({
        ProductName: product.Name,
        UniqueId: id,
      }),
    },
  )

  const { data } = await response.json()
  store.battery = data
}

function getProduct(data: DeviceInfo) {
  let datasets = DEVICE_DATA as ProductData

  type ProductKey = keyof typeof datasets
  let product = datasets[data.ProductType as ProductKey] as Product
  if (Array.isArray(product)) product = product[0]

  let color = product[data.DeviceColor]
  if (data.ModelNumber.length === 12) {
    const suffix = data.ModelNumber.slice(-4)
    color = datasets[suffix as ProductKey] as string
  }

  return {
    Name: product.Name,
    Chip: product.Chip,
    Color: color || data.DeviceColor,
  }
}

function handleDisconnect(value: string) {
  const deviceId = value.split(':')[1]

  for (const key of store.deviceMap.keys()) {
    const keyPrefix = key.split(':')[0]
    if (keyPrefix === deviceId) {
      store.deviceMap.delete(key)
      store.productMap.delete(key)
      store.infoMap.delete(key)
    }
  }

  if (store.deviceMap.size === 0) {
    store.status = ConnStatus.DISCONNECTED
  }

  if (store.deviceMap.size > 0) {
    const key = store.deviceMap.keys().next().value!
    store.selectedDevice = key
  }
}
</script>

<template>
  <div class="relative p-4 h-full">
    <TransitionGroup name="fade-in">
      <WaitConnect v-if="visible.waiting" key="waiting" />
      <PluginDownload v-if="visible.plugin" key="plugin" />

      <div v-if="visible.connected" key="connected" class="flex">
        <DevicePhoneDisplay />

        <div class="flex-1 min-w-[800px] max-w-screen-lg py-4">
          <div class="overflow-hidden border rounded-lg mb-4">
            <DeviceInfoHeader />
            <DeviceInfoGrid />
          </div>

          <div class="flex space-x-4">
            <DeviceBatteryInfo class="flex-1" />
            <DeviceDiskInfo class="flex-1" />
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
