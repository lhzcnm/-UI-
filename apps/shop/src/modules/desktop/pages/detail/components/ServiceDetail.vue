<script setup lang="ts">
import type { Service } from '@/inters/services'
import { IMEI_TYPE_MAP } from '@3un/utils'

interface ServiceDetailProps {
  service: Service,
}

defineProps<ServiceDetailProps>()

const { t } = useI18n()
</script>

<template>
  <div
    class="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 shadow-sm bg-white dark:bg-zinc-900 space-y-4"
  >
    <h2 class="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
      {{ service.title }}
    </h2>

    <p class="text-zinc-600 dark:text-zinc-400 leading-relaxed" v-html="service.mustRead">
      
    </p>

    <div class="flex items-center border border-primary/20 rounded-md dark:bg-zinc-800">
      <div
        class="w-24 min-w-[12rem] text-center py-2 rounded-l-md bg-zinc-300 dark:bg-zinc-600 border-r border-border"
      >
        {{ t('shop.form.support') }}
      </div>
      <div class="flex-1 px-3">
        {{ t(IMEI_TYPE_MAP[service.imeiType].key!) }}
      </div>
    </div>

    <div class="flex items-center border border-primary/20 rounded-md dark:bg-zinc-800">
      <div
        class="w-24 min-w-[12rem] text-center py-2 rounded-l-md bg-zinc-300 dark:bg-zinc-600 border-r border-border"
      >
        {{ t('shop.form.taken') }}
      </div>
      <div class="flex-1 px-3">
        {{ service.taken }}
      </div>
    </div>
  </div>
</template>

