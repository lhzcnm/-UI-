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
import type { BatteryInfo, DeviceInfo } from './types'
import { DEVICE_STORE, ConnStatus, deviceConfig } from './utils'
import devicesIos from '@/assets/devices-ios.json'

const store: DeviceStore = reactive({
  deviceChipMap: new Map(),
  deviceMap: new Map(),
  infoMap: new Map(),
  battery: {} as BatteryInfo,
  status: ConnStatus.IDLE,
  screenshot: '',
  selectedDevice: '',
})

provide(DEVICE_STORE, store)

await checkPlugin()

const visible = computed(() => ({
  waiting: store.status === ConnStatus.IDLE || store.status === ConnStatus.DISCONNECTED,
  plugin: store.status === ConnStatus.PLUGIN_NOT_INSTALLED,
  connected: store.status === ConnStatus.CONNECTED,
}))

const { data } = useWebSocket(
  deviceConfig.ws,
  { heartbeat: { interval: 30000 } },
)

watch(data, (value) => {
  if (value === 'pong') return
  if (value.startsWith('disconnected:')) {
    handleDisconnect(value)
    return
  }

  const data = JSON.parse(value) as DeviceInfo
  const key = `${data.DeviceID}:${data.UniqueDeviceID}`

  type DeviceType = keyof typeof devicesIos
  const chip = devicesIos[data.ProductType as DeviceType]
  if (Array.isArray(chip)) store.deviceChipMap.set(key, chip[0])
  else store.deviceChipMap.set(key, chip)

  store.deviceMap.set(key, data)
  store.infoMap.set(key, {
    SerialNumber: data.SerialNumber,
    CPU: store.deviceChipMap.get(key)?.Chip || '--',
    InternationalMobileEquipmentIdentity: data.InternationalMobileEquipmentIdentity,
    WirelessBoardSerialNumber: data.WirelessBoardSerialNumber,
    ModelNumber: data.ModelNumber,
    RegionInfo: data.RegionInfo,
    ProductVersion: data.ProductVersion,
    BuildVersion: data.BuildVersion,
    UniqueChipID: data.UniqueChipID.toString(),
    UniqueDeviceID: data.UniqueDeviceID,
    ActivationState: data.ActivationState ? '已激活' : '未激活',
    iCloud: data.CloudBackupEnabled ? '已开启' : '未开启',
    NetworkLock: '--',
    ActivationLock: '--',
  })

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
    setTimeout(() => controller.abort(), 3000)
    await fetch(deviceConfig.api, {
      signal: controller.signal,
    })
  }
  catch (error) {
    store.status = ConnStatus.PLUGIN_NOT_INSTALLED
    console.error('Plugin not installed')
  }
}

async function getScreenshot(id: string) {
  const response = await fetch(`${deviceConfig.api}/screenshot/${id}`)
  const blob = await response.blob()
  store.screenshot = URL.createObjectURL(blob)
}

async function getBatteryInfo(id: string) {
  const response = await fetch(`${deviceConfig.api}/battery/${id}`)
  const { data } = await response.json()
  store.battery = data
}

function handleDisconnect(value: string) {
  const deviceId = value.split(':')[0]

  for (const key of store.deviceMap.keys()) {
    const keyPrefix = key.split(':')[0]
    if (keyPrefix === deviceId) {
      store.deviceMap.delete(key)
      store.deviceChipMap.delete(key)
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
