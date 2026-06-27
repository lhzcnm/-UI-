<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { maskText } from '@/utils'

const store = useUserStore()
const { copy } = useClipboard({ legacy: true })
const localStore = useLocalStore()

async function handleCopy() {
  await copy(store.info.bulkCheckApi)
  toast.success(localStore.localData['profile_SuccessCopy'])
}

async function handleRefresh() {
  await store.refreshBulkApi()
  toast.success(localStore.localData['profile_SuccessRefresh'])
}


async function handleOpenBulkCheckApi() {
  if (Number(store.info.credits) < 10) {
    toast.warning(localStore.localData['profile_PromptApiError'])
    return
  }

  await store.openAllApi()
  toast.success(localStore.localData['profile_ActionActivate'])
}
</script>

<template>
  <div class="border rounded-lg p-6 mr-6 bg-card">
    <h3 class="text-lg mb-4">{{localStore.localData['profile_ApiKeyTitle']}}</h3>

    <div v-if="store.info.bulkCheckApi.trim()" class="space-y-2">
      <div class="flex items-center space-x-2 px-3 h-10 bg-muted rounded-lg">
        <Icon icon="lucide:key-round" class=" size-4 text-muted-foreground" />
        <span class="text-sm font-mono">{{ maskText(store.info.bulkCheckApi, 8, 18) }}</span>
      </div>

      <div class="space-x-2">
        <XButton icon="lucide:refresh-cw" :label="localStore.localData['profile_Refresh']" @click="handleRefresh" />
        <XButton icon="lucide:copy" :label="localStore.localData['profile_Copy']" color="success" @click="handleCopy" />
      </div>
    </div>

    <div v-else class="flex justify-center">
      <XButton color="success" :label="localStore.localData['profile_buttonApi']" @click="handleOpenBulkCheckApi" />
    </div>
  </div>
</template>
