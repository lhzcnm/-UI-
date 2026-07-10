<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { xconfirm } from '@3un/utils'

import { maskText, stringReplace } from '@/utils'

const store = useUserStore()
const iStore = useSettingStore()
// const { locale } = useI18n()
const systemStore = useSystemStore()
const localStore = useLocalStore()

const { copy, copied } = useClipboard({ legacy: true })

const zhContent = stringReplace(
  iStore.settings.apiUsageInfo,
  {
    name: store.info.username,
    key: store.info.apiKey,
    srv: '1046',
    imei: '356715082630875'
  }
)
const enContent = stringReplace(
  iStore.settings.apiUsageInfoEn,
  {
    name: store.info.username,
    key: store.info.apiKey,
    srv: '1046',
    imei: '356715082630875'
  }
)

watch(copied, (value) => value && toast.success(localStore.localData['profile_SuccessCopy']))

const apiUsageContent = computed(() => {
  return systemStore.isEn
    ? enContent
      ? enContent
      : zhContent
    : zhContent
})

async function handleRefresh() {
  await store.refreshApi()
  toast.success(localStore.localData['profile_SuccessRefresh'])
}

function openApiUsageInfo() {
  xconfirm({
    title: localStore.localData['profile_APIUsageInstructions'],
    text: apiUsageContent.value,
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
