<script setup lang="ts">
import { ua } from '@3un/utils'
import { useThrottleFn } from '@vueuse/core'

import { type PluginInfo } from '@/types/plugin'
import { checkPluginVersion, getPluginInfo } from '@/utils/plugin'
import { tv } from 'tailwind-variants'

const localStore = useLocalStore()

const isNotLatest = ref<boolean>(false)

const splitOptions = [
  { label: 'Windows', command: () => handleDownload(43) },
  { label: 'MacOS Arm', command: () => handleDownload(44) },
  { label: 'MacOS Intel', command: () => handleDownload(45) },
]

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

let pluginInfo: PluginInfo = {
  version: '1.0.0',
} 

async function getInfo() {
  try {
    pluginInfo = await getPluginInfo()
  } catch {
    isNotLatest.value = true
  }
}

async function checkVersion() {
  isNotLatest.value = await checkPluginVersion(pluginInfo.version)
}

await getInfo()
await checkVersion()

const style = tv({
  slots: {
    root: [
      'mb-4 overflow-hidden rounded-xl border p-4 transition-all animate-in fade-in slide-in-from-top-2',
      'border-danger'
    ],
    container: 'flex items-center gap-3 flex-wrap'
  }
})

const b = style()
</script>

<template>
  <div v-if="isNotLatest" :class="b.root()">
    <div :class="b.container()">
      <div class="flex-1 space-y-1 flex gap-2 items-center flex-wrap">
        <h4>{{ localStore.localData['print_Optimal'] }}</h4>
        <XButtonSplit
          size="sm"
          :options="splitOptions"
          :label="localStore.localData['device_DownloadPlugin']"
          :open-click="true"
        />
        <XButton size="sm" :label="localStore.localData['device_RefreshButton']" @click="$router.go(0)" />
      </div>
    </div>
  </div>
</template>
