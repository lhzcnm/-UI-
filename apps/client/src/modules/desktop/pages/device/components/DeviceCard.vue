<script setup lang="ts">
import type { Device } from '../types'
import { DEVICE_STORE, DEVICE_CONFIG, getCopyToken, getPrintPayload } from '../utils'

import { useClipboard } from "@vueuse/core"
import { toast } from "vue-sonner"

interface DeviceCardProps {
  device: Device
}

const props = defineProps<DeviceCardProps>()
const { info, product, form } = props.device

const { copy } = useClipboard({ legacy: true })

const store = inject(DEVICE_STORE)!
const isPrinting = ref(false)

const diskCapacity = computed(() => {
  const total = info.TotalDiskCapacity
  return `${total / 1000 / 1000 / 1000}GB`
})

function toDevice() {
  store.selected = `${info.DeviceID}:${info.UniqueDeviceID}`
  store.status = 'detail'
}

async function handlePrint() {
  isPrinting.value = true

  const payload = getPrintPayload(props.device)
  const response = await fetch(
    `${DEVICE_CONFIG.api}/print`,
    { method: 'POST', body: payload },
  )

  const blob = await response.blob()
  window.open(URL.createObjectURL(blob), '_blank')
  isPrinting.value = false
}

function handleCopy() {
  const tokens = getCopyToken(form)

  copy(tokens.map(([key, value]) => `${key}: ${value}`).join('\n'))
  toast.success('复制成功')
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
        <p>序列号：{{ info.SerialNumber }}</p>
        <p>型号：{{ info.ModelNumber }} {{ info.RegionInfo }}</p>
      </div>
    </div>
    <div class="flex items-center space-x-2 pt-3 border-t border-dashed">
      <XButton
        class="flex-1"
        size="sm" variant="outline"
        color="success" label="一键复制"
        @click="handleCopy"
      />
      <XButton
        class="flex-1"
        size="sm" variant="outline"
        color="success" label="打印标签"
        :loading="isPrinting"
        @click="handlePrint"
      />
      <XButton
        class="flex-1"
        size="sm" label="查看设备"
        @click="toDevice"
      />
    </div>
  </div>
</template>
