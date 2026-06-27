<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'

import { maskText } from '@/utils'

const store = useUserStore()
const iStore = useSettingStore()
const {  locale } = useI18n()
const localStore = useLocalStore()

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success(localStore.localData['profile_SuccessCopy']))

async function handleRefresh() {
  await store.refreshApi()
  toast.success(localStore.localData['profile_SuccessRefresh'])
}

function openApiUsageInfo() {
  const apiUsageInfo = locale.value === 'zh'
    ? iStore.settings.apiUsageInfo
    : iStore.settings.apiUsageInfoEn
      ? iStore.settings.apiUsageInfoEn
      : iStore.settings.apiUsageInfo

  xconfirm({
    title: localStore.localData['profile_APIUsageInstructions'],
    text: apiUsageInfo,
    confirmText: localStore.localData['profile_Confirm'],
    cancelText: localStore.localData['profile_Cancel'],
  })
}
</script>

<template>
  <section v-if="store.info.allowApi && store.info.showApi" class="mb-3 p-4 bg-card rounded-lg">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-medium">API KEY</h3>
      <button
        class="flex items-center space-x-1 text-sm text-muted-foreground"
        @click="openApiUsageInfo"
      >
        <Icon icon="lucide:info" class="size-4" />
        <span class="text-sm">{{ localStore.localData['profile_UsageGuide'] }}</span>
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
        class="flex-1" :label="localStore.localData['profile_Refresh']"
        @click="handleRefresh"
      />
      <XButton
        icon="lucide:copy" class="flex-1"
        color="success" :label="localStore.localData['profile_Copy']"
        @click="copy(store.info.apiKey)"
      />
    </div>
  </section>
</template>
