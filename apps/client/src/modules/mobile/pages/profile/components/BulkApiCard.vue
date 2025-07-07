<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

import { maskText } from '@/utils'

const store = useUserStore()

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success('复制成功'))

async function handleRefresh() {
  await store.refreshBulkApi()
  toast.success('刷新成功')
}

async function handleOpenBulkCheckApi() {
  if (Number(store.info.credits) < 10) {
    toast.warning('低于 10 积分不支持开通')
    return
  }

  await store.openBulkApi()
  toast.success('开通成功')
}
</script>

<template>
  <section v-if="store.info.bulkCheckApi" class="mb-3 p-4 bg-card rounded-lg">
    <h3 class="text-base font-medium mb-3">批量查询 API</h3>
    <div class="flex items-center space-x-2 px-3 h-10 bg-muted rounded-lg">
      <Icon icon="lucide:key-round" class=" size-4 text-muted-foreground" />
      <span class="text-sm font-mono">{{ maskText(store.info.bulkCheckApi, 8, 18) }}</span>
    </div>
    <div class="flex items-center space-x-2 mt-3">
      <XButton
        icon="lucide:refresh-cw" class="flex-1" label="刷新"
        @click="handleRefresh"
      />
      <XButton
        icon="lucide:copy" class="flex-1" color="success" label="复制"
        @click="copy(store.info.bulkCheckApi)"
      />
    </div>
  </section>
  <section v-else class="mb-3 p-4 bg-card rounded-lg text-center">
    <XButton
      color="success" label="开通批量查询 API KEY"
      @click="handleOpenBulkCheckApi"
    />
  </section>
</template>
