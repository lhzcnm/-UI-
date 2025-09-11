<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { useClipboard } from '@vueuse/core'

import { maskText } from '@/utils'

const store = useUserStore()
const iStore = useSettingStore()
const showApiUsageInfo = ref(false)

const { copy } = useClipboard({ legacy: true })
const { t } = useI18n()

async function handleCopy() {
  await copy(store.info.apiKey)
  toast.success(t('submit.success', { action: t('action.copy') }))
}

async function handleRefresh() {
  await store.refreshApi()
  toast.success(t('submit.success', { action: t('action.refresh') }))
}
</script>

<template>
  <div v-if="store.info.allowApi" class="border rounded-lg p-6 mr-6 bg-card">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-medium">API KEY</h3>
      <button
        class="flex items-center space-x-1 text-sm text-muted-foreground"
        @click="showApiUsageInfo = true"
      >
        <Icon icon="lucide:info" class="size-4" />
        <span class="text-sm">{{ t('profile.apiKey.useInfo') }}</span>
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
        <XButton icon="lucide:refresh-cw" :label="t('button.fresh')" @click="handleRefresh" />
        <XButton icon="lucide:copy" :label="t('button.copy')" color="success" @click="handleCopy" />
      </div>      
    </div>

    <XDialog
      v-model="showApiUsageInfo"
      :text="iStore.settings.apiUsageInfo"
      :title="t('profile.apiKey.info')"
      ui-root="sm:max-w-2xl"
      ui-text="tiptap"
    />
  </div>
</template>
