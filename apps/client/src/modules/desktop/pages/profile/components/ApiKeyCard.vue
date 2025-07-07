<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { useClipboard } from '@vueuse/core'
import { xconfirm } from '@3un/utils'

import { maskText } from '@/utils'

const store = useUserStore()
const iStore = useSettingStore()

const { copy } = useClipboard({ legacy: true })

async function handleCopy() {
  await copy(store.info.apiKey)
  toast.success('复制成功')
}

async function handleRefresh() {
  await store.refreshApi()
  toast.success('刷新成功')
}

function openApiUsageInfo() {
  const apiUsageInfo = iStore.settings.apiUsageInfo

  xconfirm({
    title: 'API 使用说明',
    text: apiUsageInfo,
    confirmText: '知道了',
    cancelText: '取消',
  })
}
</script>

<template>
  <div v-if="store.info.allowApi" class="border rounded-lg p-6 bg-card">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-medium">API KEY</h3>
      <button
        class="flex items-center space-x-1 text-sm text-muted-foreground"
        @click="openApiUsageInfo"
      >
        <Icon icon="lucide:info" class="size-4" />
        <span class="text-sm">使用说明</span>
      </button>
    </div>

    <div class="space-y-2">
      <div class="flex items-center space-x-2 px-3 h-10 bg-muted rounded-lg">
        <Icon icon="lucide:key-round" class=" size-4 text-muted-foreground" />
        <span class="text-sm font-mono whitespace-nowrap uppercase truncate">
          {{ maskText(store.info.apiKey, 12, 26) }}
        </span>
      </div>

      <div class="space-x-2">
        <XButton icon="lucide:refresh-cw" label="刷新" @click="handleRefresh" />
        <XButton icon="lucide:copy" label="复制" color="success" @click="handleCopy" />
      </div>      
    </div>
  </div>
</template>
