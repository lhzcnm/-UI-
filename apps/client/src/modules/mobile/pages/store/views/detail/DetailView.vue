<script setup lang="ts">
import { IMEI_TYPE_MAP } from '@3un/utils'

import type { DetailStepEmits } from '@mobile/pages/store/utils/types'
import { SERVICE_STORE } from '@mobile/pages/store/utils/symbol'

const store = inject(SERVICE_STORE)!
const emits = defineEmits<DetailStepEmits>()

const service = store.selService!

const { t } = useI18n()
</script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-5 space-y-4 transition-colors"
  >
    <div class="flex flex-col items-center">
      <span class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {{ service.title }}
      </span>
      <span class="text-xl font-bold text-primary">￥{{ service.storePrice }} / 次</span>
    </div>

    <div class="flex flex-col divide-y divide-zinc-200 dark:divide-zinc-800 text-sm text-zinc-700 dark:text-zinc-300">
      <div class="flex justify-between py-2">
        <span class="text-zinc-500 dark:text-zinc-400">支持类型</span>
        <span class="font-medium">{{ t(IMEI_TYPE_MAP[service!.imeiType].key!) }}</span>
      </div>
      <div class="flex justify-between py-2">
        <span class="text-zinc-500 dark:text-zinc-400">服务处理用时</span>
        <span class="font-medium">{{ service.taken }}</span>
      </div>
    </div>

    <div class="flex flex-col space-y-2">
      <span class="text-base font-medium text-zinc-800 dark:text-zinc-100">下单前必读</span>
      <div
        class="p-4 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm leading-relaxed text-zinc-700 dark:text-zinc-300"
        v-html="service.mustRead"
      ></div>
    </div>

    <div class="flex justify-end pt-2">
      <XButton
        label="下一步"
        class="px-6 py-2 rounded-lg text-sm font-semibold shadow-sm"
        @click="emits('next', 'order')"
      />
    </div>
  </div>
</template>

