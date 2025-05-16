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
import type { DeviceInfo, BatteryInfo } from './types'
import { DEVICE_STORE, ConnStatus, deviceConfig } from './utils'

import devicesIos from '@/assets/devices-ios.json'

const store = reactive<DeviceStore>({
  status: ConnStatus.IDLE,
  info: {} as DeviceInfo,
  battery: {} as BatteryInfo,
  deviceChip: {
    Name: '',
    Chip: '',
  },
  screenshot: '',
  ws: null,
})

provide(DEVICE_STORE, store)
await getDeviceInfo()

async function getDeviceInfo() {
  try {
    await checkPlugin()
    await Promise.all([
      getScreenshot(),
      getBatteryInfo(),
    ])

    const { data } = useWebSocket(deviceConfig.ws)

    watch(data, (value) => {
      if (value === 'disconnected') {
        store.status = ConnStatus.DISCONNECTED
        return
      }

      store.status = ConnStatus.CONNECTED
      store.info = JSON.parse(value)

      type DeviceType = keyof typeof devicesIos
      const device = devicesIos[store.info.ProductType as DeviceType]
      if (Array.isArray(device)) store.deviceChip = device[0]
      else store.deviceChip = device
    })
  }
  catch (error) {
    console.error(error)
    store.status = ConnStatus.PLUGIN_NOT_INSTALLED
  }
}

async function checkPlugin() {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 3000)
  await fetch(deviceConfig.api, {
    signal: controller.signal,
  })
}

async function getScreenshot() {
  const response = await fetch(`${deviceConfig.api}/screenshot`)
  const blob = await response.blob()
  store.screenshot = URL.createObjectURL(blob)
}

async function getBatteryInfo() {
  const response = await fetch(`${deviceConfig.api}/battery`)
  const { data } = await response.json()
  store.battery = data
}
</script>

<template>
  <div class="relative p-4 h-full">
    <TransitionGroup name="fade-in">
      <WaitConnect
        v-if="store.status === ConnStatus.IDLE || store.status === ConnStatus.DISCONNECTED"
        key="waiting"
      />

      <PluginDownload
        v-if="store.status === ConnStatus.PLUGIN_NOT_INSTALLED"
        key="plugin"
      />

      <div
        v-if="store.status === ConnStatus.CONNECTED"
        key="connected"
        class="flex"
      >
        <DevicePhoneDisplay />

        <div class="flex-1 min-w-[800px] max-w-screen-lg py-4">
          <div class="overflow-hidden border rounded-lg mb-4">
            <DeviceInfoHeader />
            <DeviceInfoGrid />
          </div>

          <div class="flex flex-wrap space-x-4">
            <DeviceBatteryInfo class="flex-1" />
            <DeviceDiskInfo class="flex-1" />
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
