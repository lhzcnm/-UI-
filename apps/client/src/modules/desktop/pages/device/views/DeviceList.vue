<script setup lang="ts">
import DeviceCard from '../components/DeviceCard.vue'
import { DEVICE_STORE } from '../utils'

const store = inject(DEVICE_STORE)!
</script>

<template>
  <div>
    <div class="mb-4">
      <h2 class="text-xl font-bold text-foreground">设备列表</h2>
      <p class="text-sm text-muted-foreground">共 {{ store.deviceMap.size }} 台设备</p>
    </div>

    <TransitionGroup
      tag="div"
      name="slide-vertical"
      class="grid grid-cols-[repeat(auto-fill,minmax(280px,_1fr))] gap-4"
    >
      <DeviceCard
        v-for="[key, device] in store.deviceMap"
        :key="key" :device="device"
      />
    </TransitionGroup>
  </div>
</template>
