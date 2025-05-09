<script setup lang="ts">
import DevicePhoneDisplay from './components/DevicePhoneDisplay.vue'
import DeviceInfoHeader from './components/DeviceInfoHeader.vue'
import DeviceInfoGrid from './components/DeviceInfoGrid.vue'
import DeviceBatteryInfo from './components/DeviceBatteryInfo.vue'
import DeviceInfoTabs from './components/DeviceInfoTabs.vue'
import type { DeviceInfo } from './types'

const deviceInfo = ref<DeviceInfo>({
  model: 'iPhone 16 Pro',
  capacity: '256GB',
  serialNumber: 'D4PV7N65F7',
  jailbreakStatus: '未越狱',
  boardNumber: 'F3YHAS01BRL0000FE1',
  imei: '350364291652796',
  ecid: '00051460269080lC',
  osVersion: '18.4.1 (22E252)',
  screenManufacturer: 'LG屏',
  udid: '00008140-00051460269080lC',
  modelNumber: 'MYLV3 CH/A (中国)',
  activationStatus: '已激活',
  icloud: '未开启',
  warranty: '--',
  wifi: '低温WiFi (WiFi匹配)',
  cpu: 'A18 Pro/六核',
  crashAnalysis: 'CPU问题',
  batteryHealth: '100.0%',
  cycleCount: '166次'
})

const currentTime = ref('19:45')
const currentDate = ref('5月8日 星期四')
</script>

<template>
  <div class="p-4 flex">
    <DevicePhoneDisplay
      :time="currentTime"
      :date="currentDate"
    />

    <div class="flex-1 py-4">
      <div class="overflow-hidden border rounded-lg mb-4">
        <DeviceInfoHeader
          :model="deviceInfo.model"
          :capacity="deviceInfo.capacity"
          :battery-percentage="61"
        />
  
        <DeviceInfoGrid :device-info="deviceInfo" />
      </div>

      <div class="flex space-x-4">
        <DeviceBatteryInfo
          :battery-health="deviceInfo.batteryHealth"
          :cycle-count="deviceInfo.cycleCount"
        />
  
        <DeviceInfoTabs />
      </div>
    </div>
  </div>
</template>
