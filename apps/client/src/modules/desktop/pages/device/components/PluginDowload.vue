<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core'
import { ua } from '@3un/utils'

const { t } = useI18n()

const handleDownload = useThrottleFn(
  (id?: number) => {
    const baseUrl = import.meta.env.VITE_API_URL
    let platform = id

    if (id === undefined) {
      const options = { Windows: 43, MacOS: 44 }
      platform = options[ua.os as keyof typeof options]
    }

    location.href = `${baseUrl}/oss/download/${platform}`
  },
  2000
)

const options = [
  { label: 'Windows', command: () => handleDownload(43) },,
  { label: 'MacOS Arm', command: () => handleDownload(44) },
  { label: 'MacOS Intel', command: () => handleDownload(45) },
]
</script>

<template>
  <XButtonSplit
    :label="t('device.button.download')" :options="options"
    @click="handleDownload()"
  />
</template>
