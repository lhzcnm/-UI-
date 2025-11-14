<script setup lang="ts">
import { useClipboard } from "@vueuse/core"
import { toast } from "vue-sonner"

import type { DeviceMapItem } from '../types'
import { STORE, getCopyToken, getCopyTokenEn } from '../utils'

interface DeviceCardProps {
  device: DeviceMapItem
}

const props = defineProps<DeviceCardProps>()

const { info, memory, product, summary, deviceId } = props.device
const currentKey = `${deviceId}:${info.UniqueDeviceID}`

const { copy } = useClipboard({ legacy: true })
const { t, locale } = useI18n()

const store = inject(STORE)!
const isPrinting = ref(false)

const diskCapacity = computed(() => {
  const total = memory.TotalDiskCapacity
  return `${total / 1000 / 1000 / 1000}GB`
})

function toDevice() {
  store.selected = currentKey
  store.deviceStatus = 'detail'
}

async function handlePrint() {
  store.printIndex = currentKey
  store.visiblePrint = true
}

function handleCopy() {
  const tokens = locale.value === 'zh' ? getCopyToken(summary) : getCopyTokenEn(summary)

  copy(tokens.map(([key, value]) => `${key}: ${value}`).join('\n'))
  toast.success(t('submit.success', { action: t('action.copy') }))
}
</script>

<template>
  <div class="p-4 bg-card border rounded hover:shadow transition-all duration-200">
    <div class="mb-4">
      <div class="flex items-center justify-between mb-1">
        <h3 class="flex-1 text-lg font-semibold truncate">{{ product.Name }}</h3>
        <XTag color="primary" :label="diskCapacity" size="sm" />
      </div>
      <div class="text-sm text-muted-foreground">
        <p>{{ t('device.card.serial') }}: {{ info.SerialNumber }}</p>
        <p>{{ t('device.card.type') }}: {{ info.ModelNumber }} {{ info.RegionInfo }}</p>
      </div>
    </div>
    <div class="flex items-center space-x-2 pt-3 border-t border-dashed">
      <XButton
        class="flex-1"
        size="sm" variant="outline"
        color="success" :label="t('device.button.copy')"
        @click="handleCopy"
      />
      <XButton
        class="flex-1"
        size="sm" variant="outline"
        color="success" :label="t('device.button.print')"
        :loading="isPrinting"
        @click="handlePrint"
      />
      <XButton
        class="flex-1"
        size="sm" :label="t('device.button.view')"
        @click="toDevice"
      />
    </div>
  </div>
</template>
