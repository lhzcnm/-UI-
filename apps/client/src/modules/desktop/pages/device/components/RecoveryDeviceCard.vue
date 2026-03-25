<script setup lang="ts">
import axios from 'axios'

import type { DeviceRecoveryMapItem } from '@/types/device'

interface RecoveryDeviceCardProps {
  device: DeviceRecoveryMapItem
  ecid: string
}

const { device, ecid } = defineProps<RecoveryDeviceCardProps>()

const { t } = useI18n()

async function handleLeaveRecovery() {
  try {
    await axios.get(
      `http://localhost:9999/irecovery/${ecid}`,
      {
        headers: {
          'x-token': Date.now().toString(16)
        }
      }
    )
  } catch {}
}
</script>

<template>
  <div class="p-4 bg-card border rounded hover:shadow transition-all duration-200">
    <div class="mb-4">
      <div class="flex items-center justify-between">
        <h3 class="flex-1 text-lg font-semibold truncate">{{ device.name }}</h3>
        <!-- <XTag color="primary"  -->
      </div>

      <div class="text-sm text-muted-foreground">
        <p>{{ t('device.card.serial') }}: {{ device.serialNo }}</p>
        <p>ECID: {{ device.ecid.replace('0x', '') }}</p>
      </div>
    </div>

    <div class="flex items-center gap-2 pt-3 border-t border-dashed">
      <XButton label="退出恢复模式"
        class="flex-1"
        size="sm"
        color="success" @click="handleLeaveRecovery" />
    </div>
  </div>
</template>
