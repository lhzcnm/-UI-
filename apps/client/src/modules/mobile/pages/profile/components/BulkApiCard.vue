<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'

import { maskText } from '@/utils'

const store = useUserStore()
const localStore = useLocalStore()

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success(localStore.localData['profile_SuccessCopy']))

async function handleRefresh() {
  await store.refreshBulkApi()
  toast.success(localStore.localData['profile_SuccessRefresh'])
}

async function handleOpenBulkCheckApi() {
  if (Number(store.info.credits) < 10) {
    toast.warning(localStore.localData['profile_PromptApiError'])
    return
  }

  await store.openBulkApi()
  toast.success(localStore.localData['profile_ActionActivate'])
}
</script>

<template>
  <section v-if="store.info.bulkCheckApi" class="mb-3 p-4 bg-card rounded-lg">
    <h3 class="text-base font-medium mb-3">{{ localStore.localData['profile_ApiKeyTitle'] }}</h3>
    <div class="flex items-center space-x-2 px-3 h-10 bg-muted rounded-lg">
      <Icon icon="lucide:key-round" class=" size-4 text-muted-foreground" />
      <span class="text-sm font-mono">{{ maskText(store.info.bulkCheckApi, 8, 18) }}</span>
    </div>
    <div class="flex items-center space-x-2 mt-3">
      <XButton
        icon="lucide:refresh-cw" class="flex-1" :label="localStore.localData['profile_Refresh']"
        @click="handleRefresh"
      />
      <XButton
        icon="lucide:copy" class="flex-1" color="success" :label="localStore.localData['profile_Copy']"
        @click="copy(store.info.bulkCheckApi)"
      />
    </div>
  </section>
  <section v-else class="mb-3 p-4 bg-card rounded-lg text-center">
    <XButton
      color="success" :label="localStore.localData['profile_buttonApi']"
      @click="handleOpenBulkCheckApi"
    />
  </section>
</template>
