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
  const current = store.battery.NominalChargeCapacity
  const design = store.battery.DesignCapacity
  return ((current / design) * 100).toFixed(2)
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

    <div class="space-y-1">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">充电状态</span>
        <span class="font-medium">
          {{ batteryInfo.capacity === 100 ? '电池满电' : '正在充电' }}
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
          <span class="text-muted-foreground">绝对容量</span>
          <span class="font-medium">{{ store.battery.AbsoluteCapacity }} mAh</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">满电容量</span>
          <span class="font-medium">{{ store.battery.NominalChargeCapacity }} mAh</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">电池序列号</span>
          <span class="font-medium">{{ store.battery.BatterySerialNumber }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
