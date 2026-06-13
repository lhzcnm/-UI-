<script setup lang="ts">
import { useDeviceStore } from '@/stores/device'
import DeviceCard from '../components/DeviceCard.vue'
import PluginDownload from '../components/PluginDowload.vue'
import RecoveryList from '../components/RecoveryList.vue'

import { STORE } from '../utils'

const store = inject(STORE)!
const deviceStore = useDeviceStore()

const localStore = useLocalStore()
// const { t } = useI18n()
</script>

<template>
  <div class="flex flex-col gap-4">
    <div>
      <div class="flex justify-between items-center mb-4">
        <div>device.list.title
          <h2 class="text-xl font-bold text-foreground">{{ localStore.localData['device_DeviceList'] }}</h2>
          <p class="text-sm text-muted-foreground">{{ localStore.localData['device_TotalDevices'].replace('@', deviceStore.deviceMap.size.toString()) }}
          </p>
        </div>

        <div v-if="store.hasNewVersion" class="text-right">
          <div class="text-sm text-warning mb-1">
            {{ localStore.localData['device_NewFound'] }}:
          </div>
          <PluginDownload size="sm" />
        </div>
      </div>

      <TransitionGroup tag="div" name="slide-vertical"
        class="grid grid-cols-[repeat(auto-fill,minmax(280px,_1fr))] gap-4">
        <DeviceCard v-for="[key, device] in deviceStore.deviceMap" :key="key" :device="device" />
      </TransitionGroup>
    </div>

    <RecoveryList />
  </div>
</template>
