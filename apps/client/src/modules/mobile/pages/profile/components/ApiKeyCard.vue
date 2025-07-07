<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'

import { maskText } from '@/utils'

const store = useUserStore()
const iStore = useSettingStore()

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success('复制成功'))

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
  <section v-if="store.info.allowApi" class="mb-3 p-4 bg-card rounded-lg">
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

    <div class="flex items-center space-x-2 px-3 h-10 bg-muted rounded-lg ">
      <Icon icon="lucide:key-round" class=" size-4 text-muted-foreground" />
      <span class="text-sm font-mono whitespace-nowrap uppercase truncate">
        {{ maskText(store.info.apiKey, 12, 26) }}
      </span>
    </div>
    <div class="flex items-center space-x-2 mt-3">
      <XButton
        icon="lucide:refresh-cw"
        class="flex-1" label="刷新"
        @click="handleRefresh"
      />
      <XButton
        icon="lucide:copy" class="flex-1"
        color="success" label="复制"
        @click="copy(store.info.apiKey)"
      />
    </div>
  </section>
</template>
