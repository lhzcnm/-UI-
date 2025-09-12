<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

import { maskText } from '@/utils'

const store = useUserStore()
const { t } = useI18n()

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success(t('submit.success', { action: t('action.copy') })))

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
  toast.success(t('submit.success', { action: t('action.activate') }))
}
</script>

<template>
  <section v-if="store.info.bulkCheckApi" class="mb-3 p-4 bg-card rounded-lg">
    <h3 class="text-base font-medium mb-3">{{ t('profile.apiKey.title') }}</h3>
    <div class="flex items-center space-x-2 px-3 h-10 bg-muted rounded-lg">
      <Icon icon="lucide:key-round" class=" size-4 text-muted-foreground" />
      <span class="text-sm font-mono">{{ maskText(store.info.bulkCheckApi, 8, 18) }}</span>
    </div>
    <div class="flex items-center space-x-2 mt-3">
      <XButton
        icon="lucide:refresh-cw" class="flex-1" :label="t('button.fresh')"
        @click="handleRefresh"
      />
      <XButton
        icon="lucide:copy" class="flex-1" color="success" :label="t('button.copy')"
        @click="copy(store.info.bulkCheckApi)"
      />
    </div>
  </section>
  <section v-else class="mb-3 p-4 bg-card rounded-lg text-center">
    <XButton
      color="success" :label="t('profile.button.api')"
      @click="handleOpenBulkCheckApi"
    />
  </section>
</template>
