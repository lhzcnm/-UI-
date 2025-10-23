<script setup lang="ts">
import { IMEI_TYPE_MAP } from '@3un/utils'
import type { ServiceItem } from '@desktop/pages/store/api/types'

interface ServiceDetailProps {
  service: ServiceItem,
}

defineProps<ServiceDetailProps>()

const { t } = useI18n()
</script>

<!-- <template>
  <div class="h-full flex flex-col p-2 space-y-4">
    <div class="text-2xl font-semibold flex justify-between space-x-1">
      <span>{{ service.title }}</span>
      <div class="bg-danger text-white size-6 text-lg flex items-center justify-center rounded">
        <span class="p-1">热</span>
      </div>
      <div class="bg-success text-white size-6 text-lg flex items-center justify-center rounded">
        <span class="p-1">新</span>
      </div>
    </div>
    <div class="flex flex-col space-y-1">
      <div class="flex justify-between">
        <span>支持类型</span>
        <span>{{ t(IMEI_TYPE_MAP[6].key!) }}</span>
      </div>
      <div class="flex justify-between">
        <span>服务处理用时</span>
        <span>{{ service.taken }}</span>
      </div>
      <div class="flex justify-between">
        <span>单次服务价格</span>
        <span class="text-danger">{{ service.price }}</span>
      </div>
      <div v-if="service.mustRead" class="flex flex-col space-y-2">
        <span>下单前必读</span>
        <div
          class="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900"
          v-html="service.mustRead"></div>
      </div>
    </div>
  </div>
</template> -->

<template>
  <div class="h-full flex flex-col p-4 space-y-4 bg-white dark:bg-zinc-900 rounded-xl shadow-sm">
    <!-- 标题 + 标签 -->
    <div class="flex items-center flex-wrap gap-2">
      <h2 class="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        {{ service.title }}
      </h2>

      <span
        v-if="service.isHot"
        class="px-2 py-[2px] text-xs font-semibold rounded-full bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow-sm">
        热门服务
      </span>

      <span
        v-if="service.isNew"
        class="px-2 py-[2px] text-xs font-semibold rounded-full bg-gradient-to-r from-emerald-500 to-green-400 text-white shadow-sm">
        新上架
      </span>
    </div>

    <div class="flex flex-col space-y-2 text-sm md:text-base">
      <div class="flex justify-between">
        <span>支持类型</span>
        <span>{{ t(IMEI_TYPE_MAP[service.imeiType].key!) }}</span>
      </div>
      <div class="flex justify-between">
        <span>服务处理用时</span>
        <span>{{ service.taken }}</span>
      </div>
      <div class="flex justify-between">
        <span>单次服务价格</span>
        <span class="font-semibold text-transparent bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text">
          ￥{{ service.storePrice }}
        </span>
      </div>

      <div v-if="service.mustRead" class="flex flex-col space-y-2 pt-2">
        <span class="font-medium text-zinc-800 dark:text-zinc-200">下单前必读</span>
        <div
          class="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 leading-relaxed"
          v-html="service.mustRead">
        </div>
      </div>
    </div>
  </div>
</template>

