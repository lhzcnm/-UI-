<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { DEVICE_STORE } from '../utils'

const store = inject(DEVICE_STORE)!

const batteryInfo = computed(() => {
  const info = store.deviceMap.get(store.selectedDevice)!
  return {
    capacity: info.BatteryCurrentCapacity,
    isCharging: info.BatteryIsCharging,
  }
})

const batteryColor = computed(() => {
  const capacity = batteryInfo.value.capacity
  if (capacity >= 80) return 'text-green-500'
  if (capacity >= 20) return 'text-yellow-500'
  return 'text-red-500'
})

const batteryIcon = computed(() => {
  const capacity = batteryInfo.value.capacity
  if (batteryInfo.value.isCharging) return 'lucide:battery-charging'
  if (capacity >= 80) return 'lucide:battery-full'
  if (capacity >= 60) return 'lucide:battery-high'
  if (capacity >= 40) return 'lucide:battery-medium'
  if (capacity >= 20) return 'lucide:battery-low'
  return 'lucide:battery-empty'
})

const healthPercentage = computed(() => {
  if (!store.battery) return null
  const design = parseInt(store.battery.DesignCapacity)
  const current = parseInt(store.battery.FullChargeCapacity)
  return Math.round((current / design) * 100)
})
</script>

<template>
  <div class="p-4 overflow-hidden bg-card border rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">电池信息</h3>
      <div class="flex items-center space-x-1" :class="batteryColor">
        <Icon :icon="batteryIcon" class="text-2xl" />
        <span class="font-medium">{{ batteryInfo.capacity }}%</span>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">充电状态</span>
        <span class="font-medium">
          {{ batteryInfo.isCharging ? '正在充电' : '正在放电' }}
        </span>
      </div>

      <template v-if="store.battery">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">电池健康度</span>
          <span class="font-medium">{{ healthPercentage }}%</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">循环次数</span>
          <span class="font-medium">{{ store.battery.CycleCount }} 次</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">设计容量</span>
          <span class="font-medium">{{ store.battery.DesignCapacity }} mAh</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">当前满电容量</span>
          <span class="font-medium">{{ store.battery.FullChargeCapacity }} mAh</span>
        </div>
      </template>
    </div>
  </div>
</template>
