<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { DEVICE_STORE, deviceConfig } from '../utils'
import type { DeviceInfo } from '../types'
import type { BatteryInfo } from '../types'

const store = inject(DEVICE_STORE)!

const batteryInfo = computed(() => {
  const info = store.info as DeviceInfo
  return {
    capacity: info.BatteryCurrentCapacity,
    isCharging: info.BatteryIsCharging,
  }
})

const detailedBatteryInfo = ref<BatteryInfo | null>(null)

async function fetchDetailedBatteryInfo() {
  try {
    const response = await fetch(`${deviceConfig.api}/battery`)
    const data = await response.json()
    if (data.code === 200 && data.msg) {
      detailedBatteryInfo.value = data.msg
    }
  }
  catch (error) {
    console.error('Failed to fetch detailed battery info:', error)
  }
}

onMounted(() => {
  fetchDetailedBatteryInfo()
})

const batteryColor = computed(() => {
  const capacity = batteryInfo.value.capacity
  if (capacity >= 80) return 'text-green-500'
  if (capacity >= 20) return 'text-yellow-500'
  return 'text-red-500'
})

const batteryIcon = computed(() => {
  const capacity = batteryInfo.value.capacity
  if (capacity >= 80) return 'lucide:battery-full'
  if (capacity >= 60) return 'lucide:battery-high'
  if (capacity >= 40) return 'lucide:battery-medium'
  if (capacity >= 20) return 'lucide:battery-low'
  return 'lucide:battery-empty'
})

const healthPercentage = computed(() => {
  if (!detailedBatteryInfo.value) return null
  const design = parseInt(detailedBatteryInfo.value.DesignCapacity)
  const current = parseInt(detailedBatteryInfo.value.FullChargeCapacity)
  return Math.round((current / design) * 100)
})
</script>

<template>
  <div class="flex-1 p-4 overflow-hidden border rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">电池信息</h3>
      <div class="flex items-center space-x-2">
        <Icon
          :icon="batteryIcon"
          class="text-2xl"
          :class="batteryColor"
        />
        <span
          class="text-lg font-medium"
          :class="batteryColor"
        >
          {{ batteryInfo.capacity }}%
        </span>
      </div>
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted-foreground">充电状态</span>
        <span class="font-medium">
          {{ batteryInfo.isCharging ? '正在充电' : '未充电' }}
        </span>
      </div>

      <template v-if="detailedBatteryInfo">
        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">电池健康度</span>
          <span class="font-medium">
            {{ healthPercentage }}%
          </span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">循环次数</span>
          <span class="font-medium">
            {{ detailedBatteryInfo.CycleCount }} 次
          </span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">设计容量</span>
          <span class="font-medium">
            {{ detailedBatteryInfo.DesignCapacity }} mAh
          </span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <span class="text-muted-foreground">当前满电容量</span>
          <span class="font-medium">
            {{ detailedBatteryInfo.FullChargeCapacity }} mAh
          </span>
        </div>
      </template>
    </div>
  </div>
</template>
