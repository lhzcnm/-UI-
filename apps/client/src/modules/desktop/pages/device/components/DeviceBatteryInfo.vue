<script setup lang="ts">
import { Icon } from '@iconify/vue'

import type { DeviceInfo } from '../types'
import { DEVICE_STORE } from '../utils'

const store = inject(DEVICE_STORE)!

const batteryInfo = computed(() => {
  const { info, battery } = store.deviceMap.get(store.selected)!
  const capacity = info.BatteryCurrentCapacity
  const current = battery.NominalChargeCapacity
  const design = battery.DesignCapacity

  return {
    color: getColor(info, capacity),
    icon: getIcon(info, capacity),
    healthPercentage: ((current / design) * 100).toFixed(2),
    isCharging: info.BatteryIsCharging,
    currentCapacity: capacity,
    designCapacity: design,
    absoluteCapacity: battery.AbsoluteCapacity,
    nominalChargeCapacity: battery.NominalChargeCapacity,
    batterySerialNumber: battery.BatterySerialNumber,
    cycleCount: battery.CycleCount,
  }
})

function getColor(info: DeviceInfo, capacity: number) {
  if (info.BatteryIsCharging) return 'text-green-500'
  if (capacity >= 80) return 'text-green-500'
  if (capacity >= 20) return 'text-yellow-500'
  return 'text-red-500'
}

function getIcon(info: DeviceInfo, capacity: number) {
  if (info.BatteryIsCharging) return 'lucide:battery-charging'
  if (capacity >= 80) return 'lucide:battery-full'
  if (capacity >= 60) return 'lucide:battery-high'
  if (capacity >= 40) return 'lucide:battery-medium'
  if (capacity >= 20) return 'lucide:battery-low'
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

    <div class="space-y-1">
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
        <span class="text-muted-foreground">循环次数</span>
        <span class="font-medium">{{ batteryInfo.cycleCount }} 次</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">设计容量</span>
        <span class="font-medium">{{ batteryInfo.designCapacity }} mAh</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">绝对容量</span>
        <span class="font-medium">{{ batteryInfo.absoluteCapacity }} mAh</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">满电容量</span>
        <span class="font-medium">{{ batteryInfo.nominalChargeCapacity }} mAh</span>
      </div>

      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">电池序列号</span>
        <span class="font-medium">{{ batteryInfo.batterySerialNumber }}</span>
      </div>
    </div>
  </div>
</template>
