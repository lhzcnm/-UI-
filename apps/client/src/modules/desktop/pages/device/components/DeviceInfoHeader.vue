<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
import { useClipboard } from "@vueuse/core"
import { toast } from "vue-sonner"

import { STORE, getCopyToken } from '../utils'
import { wsFetch } from '../utils/websocket'

const { copy } = useClipboard({ legacy: true })
const store = inject(STORE)!

const isRecoveryMode = ref(false)
const isPrinting = ref(false)

function handleRecoveryMode() {
  const [_, uniqueId] = store.selected.split(':')
  if (isRecoveryMode.value) handleExitRecoveryMode(uniqueId)
  else handleEnterRecoveryMode(uniqueId)
}

async function handleEnterRecoveryMode(uniqueId: string) {
  await wsFetch({ type: 'enterRecoveryMode', Uid: uniqueId })
  toast.success('指令已发送')
  isRecoveryMode.value = true
}

async function handleExitRecoveryMode(uniqueId: string) {
  await wsFetch({ type: 'exitRecoveryMode', Uid: uniqueId })
  toast.success('指令已发送')
  isRecoveryMode.value = false
}

async function handlePrint() {
  const [DeviceID, _] = store.selected.split(':')
  store.visiblePrint = true
  store.printIndex = DeviceID
}

function handleCopy() {
  const device = store.deviceMap.get(store.selected)!
  const tokens = getCopyToken(device.form)

  copy(tokens.map(([key, value]) => `${key}: ${value}`).join('\n'))
  toast.success('复制成功')
}

const diskCapacity = computed(() => {
  const device = store.deviceMap.get(store.selected)!
  const total = device.memory.TotalDiskCapacity
  return `${total / 1000 / 1000 / 1000}GB`
})

const colorLabel = computed(() => {
  const device = store.deviceMap.get(store.selected)!
  return device.product.Color
})
</script>

<template>
  <div
    :class="twJoin(
      'flex justify-between items-center',
      'py-2 px-3 border-b border-dashed',
    )"
  >
    <div class="flex items-center space-x-2">
      <XSelect
        v-model="store.selected"
        placement="bottom-start"
        ui-trigger="w-44 sm:h-8"
      >
        <XSelectItem
          v-for="[key, device] in store.deviceMap" :key="key"
          :value="key" :label="device.product.Name"
        />
      </XSelect>

      <XTag
        color="primary" :label="diskCapacity"
        class="rounded-full ring-1 ring-primary"
      />

      <XTag
        color="primary" :label="colorLabel"
        class="rounded-full ring-1 ring-primary"
      />
    </div>

    <div class="flex items-center space-x-2">
      <XButton
        v-if="store.deviceMap.size"
        icon="lucide:list"
        label="设备列表" size="sm"
        @click="store.status = 'list'"
      />

      <XButton size="sm" color="success" @click="handleRecoveryMode">
        {{ isRecoveryMode ? '退出恢复模式' : '进入恢复模式' }}
      </XButton>

      <XButton
        icon="lucide:copy" size="sm"
        label="一键复制" @click="handleCopy"
      />
      <XButton
        icon="lucide:printer"
        size="sm" label="打印标签"
        :loading="isPrinting"
        @click="handlePrint"
      />
    </div>
  </div>
</template>
