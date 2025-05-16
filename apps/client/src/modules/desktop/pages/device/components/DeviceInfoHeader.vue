<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
import { DEVICE_STORE, deviceConfig } from '../utils'

const store = inject(DEVICE_STORE)!
const isRecoveryMode = ref(false)

async function handleRecoveryMode() {
  if (isRecoveryMode.value) {
    await fetch(`${deviceConfig.api}/enterRecoveryMode`)
    isRecoveryMode.value = true
  }
  else {
    await fetch(`${deviceConfig.api}/irecovery`)
    isRecoveryMode.value = false
  }
}
</script>

<template>
  <div
    :class="twJoin(
      'flex justify-between items-center',
      'p-3 pb-2 border-b border-dashed',
    )"
  >
    <h1 class="text-lg font-bold mr-2">{{ store.deviceChip.Name }}</h1>
    <div class="flex items-center space-x-2">
      <XButton
        icon="lucide:leaf" size="sm" color="success"
        @click="handleRecoveryMode"
      >
        {{ isRecoveryMode ? '退出恢复模式' : '进入恢复模式' }}
      </XButton>
    </div>
  </div>
</template>
