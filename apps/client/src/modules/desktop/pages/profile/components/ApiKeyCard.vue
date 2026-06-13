<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { useClipboard } from '@vueuse/core'

import { maskText } from '@/utils'

const store = useUserStore()
const iStore = useSettingStore()
const showApiUsageInfo = ref(false)

const { copy } = useClipboard({ legacy: true })
const { locale } = useI18n()
const localStore = useLocalStore()


const apiUsageContent = computed(() => {
  return locale.value === 'zh'
    ? iStore.settings.apiUsageInfo
    : iStore.settings.apiUsageInfoEn
      ? iStore.settings.apiUsageInfoEn
      : iStore.settings.apiUsageInfo
})

async function handleCopy() {
  await copy(store.info.apiKey)
  toast.success(localStore.localData['profile_SuccessCopy'])
}

async function handleRefresh() {
  await store.refreshApi()
  toast.success(localStore.localData['profile_SuccessRefresh'])
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
        <span class="text-sm">{{ localStore.localData['profile_UsageGuide'] }}</span>
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
        <XButton icon="lucide:refresh-cw" :label="localStore.localData['profile_Refresh']" @click="handleRefresh" />
        <XButton icon="lucide:copy" :label="localStore.localData['profile_Copy']" color="success" @click="handleCopy" />
      </div>      
    </div>

    <XDialog
      v-model="showApiUsageInfo"
      :text="apiUsageContent"
      :title="localStore.localData['profile_APIUsageInstructions']"
      ui-root="sm:max-w-2xl"
      ui-text="tiptap"
    />
  </div>
</template>
