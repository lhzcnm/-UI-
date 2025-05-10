<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { DEVICE_STORE } from '../utils'

const store = inject(DEVICE_STORE)!
</script>

<template>
  <div class="flex justify-between items-center px-4 py-2 bg-blue-800/20">
    <div class="flex items-center space-x-2">
      <h1 class="text-xl font-bold mr-2">{{ store.info.ProductType }}</h1>
    </div>
    <div class="flex items-center">
      <span class="text-sm">{{ store.info.BatteryIsCharging ? '电脑充电' : '电池放电' }}</span>
      <div class="battery-icon ml-1 relative">
        <Icon icon="material-symbols:battery-3-bar" class="text-success text-xl" />
      </div>
      <span class="text-sm">{{ store.info.BatteryCurrentCapacity }}%</span>
    </div>
  </div>
</template>
