<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
import { useClipboard } from "@vueuse/core"
import { toast } from "vue-sonner"

import { wsFetch, STORE, getCopyToken, getCopyTokenEn } from '../utils'

const { copy } = useClipboard({ legacy: true })
const store = inject(STORE)!
const { t, locale } = useI18n()

const isRecoveryMode = ref(false)
const isPrinting = ref(false)

function handleRecoveryMode() {
  const [_, uniqueId] = store.selected.split(':')
  if (isRecoveryMode.value) handleExitRecoveryMode(uniqueId)
  else handleEnterRecoveryMode(uniqueId)
}

async function handleEnterRecoveryMode(uniqueId: string) {
  await wsFetch({ type: 'enterRecoveryMode', Uid: uniqueId })
  toast.success(t('command.title', { action: t('command.success') }))
  isRecoveryMode.value = true
}

async function handleExitRecoveryMode(uniqueId: string) {
  await wsFetch({ type: 'exitRecoveryMode', Uid: uniqueId })
  toast.success(t('command.title', { action: t('command.success') }))
  isRecoveryMode.value = false
}

async function handlePrint() {
  store.visiblePrint = true
  store.printIndex = store.selected
}

function handleCopy() {
  const device = store.deviceMap.get(store.selected)!
  const tokens = locale.value === 'zh' ? getCopyToken(device.summary) : getCopyTokenEn(device.summary)

  copy(tokens.map(([key, value]) => `${key}: ${value}`).join('\n'))
  toast.success(t('submit.success', { action: t('action.copy') }))
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
        :label="t('device.list.title')" size="sm"
        @click="store.deviceStatus = 'list'"
      />

      <XButton size="sm" color="success" @click="handleRecoveryMode">
        {{ isRecoveryMode ? t('device.button.outRecover') : t('device.button.inRecover') }}
      </XButton>

      <XButton
        icon="lucide:copy" size="sm"
        :label="t('device.button.copy')" @click="handleCopy"
      />
      <XButton
        icon="lucide:printer"
        size="sm" :label="t('device.button.print')"
        :loading="isPrinting"
        @click="handlePrint"
      />
    </div>
  </div>
</template>
