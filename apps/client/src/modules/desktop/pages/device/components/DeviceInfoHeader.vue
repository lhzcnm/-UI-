<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface DeviceInfoHeaderProps {
  model: string
  capacity: string
  batteryPercentage: number
}

defineProps<DeviceInfoHeaderProps>()
</script>

<template>
  <div class="flex justify-between items-center px-4 py-2 bg-gray-800/20">
    <div class="flex items-center space-x-2">
      <h1 class="text-xl font-bold mr-2">{{ model }}</h1>
      <XTag color="primary" :label="capacity" />
      <XTag color="primary" label="无网络锁" />
      <XTag color="primary" label="ID锁未知" />
    </div>
    <div class="flex items-center">
      <span class="text-sm">电脑充电(3W)</span>
      <div class="battery-icon ml-1 relative">
        <Icon icon="material-symbols:battery-3-bar" class="text-green-500 text-xl" />
      </div>
      <span class="text-sm">{{ batteryPercentage }}%</span>
    </div>
  </div>
</template>
