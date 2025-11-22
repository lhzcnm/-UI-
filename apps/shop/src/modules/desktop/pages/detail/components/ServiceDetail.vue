<script setup lang="ts">
import type { Service } from '@/inters/services'
import { IMEI_TYPE_MAP } from '@3un/utils'

interface ServiceDetailProps {
  service: Service,
}

defineProps<ServiceDetailProps>()

const { t } = useI18n()
</script>

<!-- <template>
  <div class="w-full bg-white dark:bg-black rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-800 p-5 dark:shadow-zinc-900">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="flex-1 space-y-3 flex flex-col">
        <div class="font-semibold text-lg mb-2 flex justify-between">
          <span>{{ service.title }}</span>
          <div class="flex items-center space-x-2">
            <span
              v-if="service.isHot"
              class="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-sm">
              {{ t('shop.service.hot') }}
            </span>

            <span
              v-if="service.isNew"
              class="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-sm">
              {{ t('shop.service.new') }}
            </span>
          </div>
        </div>

        <div
          class="flex items-center border border-primary/20 rounded-md dark:bg-zinc-800"
        >
          <div
            class="w-24 min-w-[12rem] text-center py-2 rounded-l-md bg-zinc-300 dark:bg-zinc-600 border-r border-border"
          >
            {{ t('shop.form.support') }}
          </div>
          <div class="flex-1 px-3">{{ t(IMEI_TYPE_MAP[service.imeiType].key!) }}</div>
        </div>

        <div
          class="flex items-center border border-primary/20 rounded-md dark:bg-zinc-800"
        >
          <div
            class="w-24 min-w-[12rem] text-center py-2 rounded-l-md bg-zinc-300 dark:bg-zinc-600 border-r border-border"
          >
            {{ t('shop.form.taken') }}
          </div>
          <div class="flex-1 px-3">{{ service.taken }}</div>
        </div>

        <div class="flex-1 flex justify-end items-end text-base">
          <span class="">{{ t('shop.service.amount') }}: </span>
          <span class="text-orange-500 font-semibold text-lg ml-1">￥{{ service.storePrice }}</span>
        </div>
      </div>

      <div
        class="md:w-72 w-full bg-zinc-50 dark:bg-zinc-950 border border-border rounded-md p-3 text-sm leading-relaxed"
      >
        <div class="font-medium mb-2 flex items-center gap-1">
          <span class="i-heroicons-information-circle"></span>
          {{ t('shop.service.view') }}
        </div>
        <div class="overflow-y-auto max-h-64" style="scrollbar-width: none;" v-html="service.mustRead">
        </div>
      </div>
    </div>
  </div>
</template> -->

<template>
  <div
    class="rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 shadow-sm bg-white dark:bg-zinc-900 space-y-4"
  >
    <!-- 服务标题 -->
    <h2 class="text-xl font-semibold text-zinc-800 dark:text-zinc-100">
      {{ service.title }}
    </h2>

    <!-- 服务描述 -->
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

