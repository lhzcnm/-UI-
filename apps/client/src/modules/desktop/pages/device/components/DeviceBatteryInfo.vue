<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { BatteryResponse } from '@/types/device'
import { STORE } from '../utils'

const store = inject(STORE)!
const deviceStore = useDeviceStore()

const { t } = useI18n()

const batteryInfo = computed(() => {
  const { battery } = deviceStore.deviceMap.get(store.selected)!
  const current = battery.NominalChargeCapacity
  const isFull = battery.CurrentCapacity === 100
  const design = battery.DesignCapacity

  return {
    color: getColor(battery),
    icon: getIcon(battery),
    designCapacity: design,
    isCharging: battery.IsCharging,
    currentCapacity: battery.CurrentCapacity,
    label: battery.IsCharging ? t('device.info.battery.charge.ing') : (isFull ? t('device.info.battery.charge.max') : t('device.info.battery.charge.ing')),
    healthPercentage: ((current / design) * 100).toFixed(2),
    nominalChargeCapacity: battery.NominalChargeCapacity,
    temperature: battery.Temperature / 100,
    cycleCount: battery.CycleCount,
  }
})

function getColor(battery: BatteryResponse) {
  if (battery.IsCharging) return 'text-green-500'
  if (battery.CurrentCapacity >= 80) return 'text-green-500'
  if (battery.CurrentCapacity >= 20) return 'text-yellow-500'
  return 'text-red-500'
}

function getIcon(battery: BatteryResponse) {
  if (battery.IsCharging) return 'lucide:battery-charging'
  if (battery.CurrentCapacity >= 80) return 'lucide:battery-full'
  if (battery.CurrentCapacity >= 60) return 'lucide:battery-high'
  if (battery.CurrentCapacity >= 40) return 'lucide:battery-medium'
  if (battery.CurrentCapacity >= 20) return 'lucide:battery-low'
  return 'lucide:battery-empty'
}
</script>

<template>
  <div class="p-4 overflow-hidden bg-card border rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">{{ t('device.info.battery.title') }}</h3>
      <div class="flex items-center space-x-1" :class="batteryInfo.color">
        <Icon :icon="batteryInfo.icon" class="text-2xl" />
        <span class="font-medium">{{ batteryInfo.currentCapacity }}%</span>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">{{ t('device.info.battery.status') }}</span>
        <span class="font-medium">{{ batteryInfo.label }}</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">{{ t('device.info.battery.health') }}</span>
        <span class="font-medium">{{ batteryInfo.healthPercentage }}%</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">{{ t('device.info.battery.capacity') }}</span>
        <span class="font-medium">{{ batteryInfo.designCapacity }} mAh</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">{{ t('device.info.battery.max') }}</span>
        <span class="font-medium">{{ batteryInfo.nominalChargeCapacity }} mAh</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">{{ t('device.info.battery.cycle') }}</span>
        <span class="font-medium">{{ batteryInfo.cycleCount }} 次</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">{{ t('device.info.battery.temperature') }}</span>
        <span class="font-medium">{{ batteryInfo.temperature }} ℃</span>
      </div>
    </div>
  </div>
</template>
