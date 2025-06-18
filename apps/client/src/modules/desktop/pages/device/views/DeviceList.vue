<script setup lang="ts">
import DeviceCard from '../components/DeviceCard.vue'
import PluginDownload from '../components/PluginDowload.vue'
import { STORE } from '../utils'

const store = inject(STORE)!
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold text-foreground">设备列表</h2>
        <p class="text-sm text-muted-foreground">共 {{ store.deviceMap.size }} 台设备</p>
      </div>

      <div v-if="store.hasNewVersion" class="text-right">
        <div class="text-sm text-warning mb-1">
          发现新版本, 点击下载最新版本:
        </div>
        <PluginDownload size="sm" />
      </div>
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
