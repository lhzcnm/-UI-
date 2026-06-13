<script setup lang="ts">
import { useClipboard } from "@vueuse/core"
import { toast } from "vue-sonner"

import { STORE, getCopyToken, getCopyTokenEn } from '../utils'
import type { DeviceMapItem } from "@/types/device"

interface DeviceCardProps {
  device: DeviceMapItem
}

const props = defineProps<DeviceCardProps>()

const { info, memory, product, summary, deviceId } = props.device
const currentKey = `${deviceId}:${info.UniqueDeviceID}`

const { copy } = useClipboard({ legacy: true })
const {  locale } = useI18n()
const localStore = useLocalStore()

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
  store.selected = currentKey
  store.printIndex = currentKey
  store.prevStatus = store.deviceStatus
  store.deviceStatus = 'printView'
  // store.visiblePrint = true
}

function handleCopy() {
  const tokens = locale.value === 'zh' ? getCopyToken(summary) : getCopyTokenEn(summary)

  copy(tokens.map(([key, value]) => `${key}: ${value}`).join('\n'))
  toast.success(localStore.localData['device_CopySucceeded'])
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
        <p>{{ localStore.localData['device_SerialNumber'] }}: {{ info.SerialNumber }}</p>
        <p>{{ localStore.localData['device_Model'] }}: {{ info.ModelNumber }} {{ info.RegionInfo }}</p>
      </div>
    </div>
    <div class="flex items-center space-x-2 pt-3 border-t border-dashed">
      <XButton
        class="flex-1"
        size="sm" variant="outline"
        color="success" :label="localStore.localData['device_Copy']"
        @click="handleCopy"
      />
      <XButton
        class="flex-1"
        size="sm" variant="outline"
        color="success" :label="localStore.localData['device_PrintLabel']"
        :loading="isPrinting"
        @click="handlePrint"
      />
      <XButton
        class="flex-1"
        size="sm" :label="localStore.localData['device_ViewDevice']"
        @click="toDevice"
      />
    </div>
  </div>
</template>
