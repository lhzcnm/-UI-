<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { BatteryInfo } from '../types'
import { STORE } from '../utils'

const store = inject(STORE)!

const batteryInfo = computed(() => {
  const { battery } = store.deviceMap.get(store.selected)!
  const current = battery.NominalChargeCapacity
  const design = battery.DesignCapacity

  return {
    color: getColor(battery),
    icon: getIcon(battery),
    designCapacity: design,
    isCharging: battery.IsCharging,
    currentCapacity: battery.CurrentCapacity,
    healthPercentage: ((current / design) * 100).toFixed(2),
    nominalChargeCapacity: battery.NominalChargeCapacity,
    temperature: battery.Temperature / 100,
    cycleCount: battery.CycleCount,
  }
})

function getColor(battery: BatteryInfo) {
  if (battery.IsCharging) return 'text-green-500'
  if (battery.CurrentCapacity >= 80) return 'text-green-500'
  if (battery.CurrentCapacity >= 20) return 'text-yellow-500'
  return 'text-red-500'
}

function getIcon(battery: BatteryInfo) {
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
      <h3 class="text-lg font-medium">电池信息</h3>
      <div class="flex items-center space-x-1" :class="batteryInfo.color">
        <Icon :icon="batteryInfo.icon" class="text-2xl" />
        <span class="font-medium">{{ batteryInfo.currentCapacity }}%</span>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">充电状态</span>
        <span class="font-medium">
          {{ batteryInfo.isCharging ? '正在充电' : '电池满电' }}
        </span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">电池健康度</span>
        <span class="font-medium">{{ batteryInfo.healthPercentage }}%</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">设计容量</span>
        <span class="font-medium">{{ batteryInfo.designCapacity }} mAh</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">最大可用容量</span>
        <span class="font-medium">{{ batteryInfo.nominalChargeCapacity }} mAh</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">循环次数</span>
        <span class="font-medium">{{ batteryInfo.cycleCount }} 次</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">电池温度</span>
        <span class="font-medium">{{ batteryInfo.temperature }} ℃</span>
      </div>
    </div>
  </div>
</template>
