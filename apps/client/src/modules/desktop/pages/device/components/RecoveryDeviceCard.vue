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
    <div class="mb-3">
      <div class="flex items-center justify-between gap-2">
        <h3 class="flex-1 text-lg font-semibold truncate">
          {{ device.name }}
        </h3>

        <span class="text-xs px-2 py-0.5 rounded bg-muted">
          {{ device.mode }}
        </span>
      </div>

      <p class="text-xs text-muted-foreground mt-1 truncate">
        {{ device.type }} · {{ device.model }}
      </p>
    </div>

    <div class="text-sm space-y-1">
      <p>
        <span class="text-muted-foreground">SN:</span>
        {{ device.serialNo }}
      </p>

      <p>
        <span class="text-muted-foreground">ECID:</span>
        {{ device.ecid.replace('0x', '') }}
      </p>
    </div>

    <div class="my-3 border-t border-dashed"></div>

    <div class="text-xs text-muted-foreground grid grid-cols-2 gap-y-1">
      <span>Chip: {{ device.chip }}</span>
      <span>Board: {{ device.boardId }}</span>
      <span>Rev: {{ device.chipRev }}</span>
      <span v-if="device.imei">IMEI: {{ device.imei }}</span>
    </div>

    <div class="flex items-center gap-2 pt-3">
      <XButton
        :label="t('device.button.outRecover')"
        class="flex-1"
        size="sm"
        color="success"
        @click="handleLeaveRecovery"
      />
    </div>
  </div>
</template>
