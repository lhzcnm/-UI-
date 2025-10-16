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
    ui-root="sm:max-w-lg max-h-[80%] flex flex-col"
    title="服务详情"
  >
    <template #default>
      <div
        class="h-full flex flex-col gap-2 overflow-y-auto"
        style="scrollbar-width: none;">
        <div class="bg-zinc-100 dark:bg-zinc-800 rounded p-2"
        v-html="desc">
        </div>
      </div>
    </template>
    <!-- <template #footer>
      <div>
        <XButton label="确认" />
      </div>
    </template> -->
  </XDialog>
</template>
