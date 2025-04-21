<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { maskText } from '@/utils'

const store = useUserStore()
const { copy } = useClipboard({ legacy: true })

async function handleCopy() {
  await copy(store.info.bulkCheckApi)
  toast.success('复制成功')
}

async function handleRefresh() {
  await store.refreshApi()
  toast.success('刷新成功')
}

async function handleOpenBulkCheckApi() {
  if (Number(store.info.credits) < 10) {
    toast.warning('低于 10 积分不支持开通')
    return
  }

  await store.refreshApi()
  toast.success('开通成功')
}
</script>

<template>
  <div class="border rounded-lg p-6 bg-card">
    <h3 class="text-lg mb-4">API 信息</h3>

    <div v-if="store.info.bulkCheckApi" class="space-y-2">
      <div class="flex items-center space-x-2 px-3 h-10 bg-muted rounded-lg">
        <Icon icon="lucide:key-round" class=" size-4 text-muted-foreground" />
        <span class="text-sm font-mono">{{ maskText(store.info.bulkCheckApi, 8, 18) }}</span>
      </div>

      <div class="space-x-2">
        <XButton icon="lucide:refresh-cw" label="刷新" @click="handleRefresh" />
        <XButton icon="lucide:copy" label="复制" color="teal" @click="handleCopy" />
      </div>      
    </div>

    <div v-else class="flex justify-center">
      <XButton color="teal" label="开通批量查询 API KEY" @click="handleOpenBulkCheckApi" />
    </div>
  </div>
</template>
