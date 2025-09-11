<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { maskText } from '@/utils'

const store = useUserStore()
const { copy } = useClipboard({ legacy: true })
const { t } = useI18n()

async function handleCopy() {
  await copy(store.info.bulkCheckApi)
  toast.success(t('submit.success', { action: t('action.copy') }))
}

async function handleRefresh() {
  await store.refreshBulkApi()
  toast.success(t('submit.success', { action: t('action.refresh') }))
}

async function handleOpenBulkCheckApi() {
  if (Number(store.info.credits) < 10) {
    toast.warning(t('profile.prompt.apiError', { point: 10 }))
    return
  }

  await store.openBulkApi()
  toast.success(t('form.success', { action: t('action.activate') }))
}
</script>

<template>
  <div class="border rounded-lg p-6 mr-6 bg-card">
    <h3 class="text-lg mb-4">{{ t('profile.apiKey.title') }}</h3>

    <div v-if="store.info.bulkCheckApi" class="space-y-2">
      <div class="flex items-center space-x-2 px-3 h-10 bg-muted rounded-lg">
        <Icon icon="lucide:key-round" class=" size-4 text-muted-foreground" />
        <span class="text-sm font-mono">{{ maskText(store.info.bulkCheckApi, 8, 18) }}</span>
      </div>

      <div class="space-x-2">
        <XButton icon="lucide:refresh-cw" :label="t('button.fresh')" @click="handleRefresh" />
        <XButton icon="lucide:copy" :label="t('button.copy')" color="success" @click="handleCopy" />
      </div>      
    </div>

    <div v-else class="flex justify-center">
      <XButton color="success" :label="t('profile.button.api')" @click="handleOpenBulkCheckApi" />
    </div>
  </div>
</template>
