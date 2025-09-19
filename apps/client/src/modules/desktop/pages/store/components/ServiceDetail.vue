<script setup lang="ts">
import { MARKET_STORE } from '../utils/symbol'

interface ServiceDetailProps {
  desc: string | null,
}

const store = inject(MARKET_STORE)!
defineProps<ServiceDetailProps>()
</script>

<template>
  <XDialog
    v-model="store.visibleDetail"
    ui-root="sm:max-w-lg"
    title="服务详情"
  >
    <template #default>
      <div
        class="flex flex-col gap-2"
        v-if="desc">
        <span class="text-lg font-bold">说明</span>
        <div class="bg-zinc-100 dark:bg-zinc-800 rounded py-2">
          <span class="" v-html="desc"></span>
        </div>
      </div>
    </template>
  </XDialog>
</template>
