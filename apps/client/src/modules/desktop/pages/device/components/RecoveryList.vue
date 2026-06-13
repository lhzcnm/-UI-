<script setup lang="ts">
import RecoveryDeviceCard from './RecoveryDeviceCard.vue'
// import { STORE } from '../utils'

// const store = inject(STORE)!

const deviceStore = useDeviceStore()

const localStore = useLocalStore()
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold text-foreground">{{ localStore.localData['device_RecoveryList'] }}</h2>
        <p class="text-sm text-muted-foreground">
          {{ localStore.localData['device_TotalDevicesRecovery'].replace('@', deviceStore.recoveryDeviceMap.size.toString()) }}</p>
      </div>
    </div>


    <TransitionGroup tag="div" name="slide-vertical"
      class="grid grid-cols-[repeat(auto-fill,minmax(280px,_1fr))] gap-4">
      <template v-for="[key, device] in deviceStore.recoveryDeviceMap" :key="key">
        <RecoveryDeviceCard :device="device" :ecid="key" />
      </template>
    </TransitionGroup>
  </div>
</template>
