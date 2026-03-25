<script setup lang="ts">
import { STORE } from '../utils'
import RecoveryDeviceCard from './RecoveryDeviceCard.vue';

const store = inject(STORE)!

const { t } = useI18n()
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div>
        <h2 class="text-xl font-bold text-foreground">{{ t('device.recoverys.title') }}</h2>
        <p class="text-sm text-muted-foreground">{{ t('device.recoverys.total', { total: store.recoverDeviceMap.size }) }}</p>
      </div>
    </div>

    
    <TransitionGroup
      tag="div" name="slide-vertical"
      class="grid grid-cols-[repeat(auto-fill,minmax(280px,_1fr))] gap-4"
    >
      <template v-for="[key, device] in store.recoverDeviceMap" :key="key">
        <RecoveryDeviceCard :device="device" :ecid="key" />
      </template>
    </TransitionGroup>
  </div>
</template>
