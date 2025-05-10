<script setup lang="ts">
import DevicePhoneDisplay from './components/DevicePhoneDisplay.vue'
import DeviceInfoHeader from './components/DeviceInfoHeader.vue'
import DeviceInfoGrid from './components/DeviceInfoGrid.vue'
import DeviceBatteryInfo from './components/DeviceBatteryInfo.vue'
import DeviceInfoTabs from './components/DeviceInfoTabs.vue'
import type { DeviceInfo } from './types'
import type { DeviceStore } from './utils'
import { DEVICE_STORE } from './utils'

const store = reactive<DeviceStore>({
  info: {} as DeviceInfo,
})

provide(DEVICE_STORE, store)

onMounted(() => getDeviceInfo())

async function getDeviceInfo() {
  const response = await fetch('http://192.168.10.3:9999')
  const data = await response.json()
  store.info = data
}
</script>

<template>
  <div class="p-4 flex">
    <DevicePhoneDisplay />

    <div class="flex-1 py-4">
      <div class=" max-w-4xl overflow-hidden border rounded-lg mb-4">
        <DeviceInfoHeader />
        <DeviceInfoGrid />
      </div>

      <div class="flex space-x-4">
        <DeviceBatteryInfo />
        <DeviceInfoTabs />
      </div>
    </div>
  </div>
</template>
