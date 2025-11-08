<script setup lang="ts">
import { orderSearch } from '@/api/store'
import TheGlobalBack from './TheGlobalBack.vue'

import { tv } from 'tailwind-variants'
import type { OrderSearchParams } from '@/api/store/types'
import { toast } from 'vue-sonner'

const { t } = useI18n()

const orderNo = ref<string>('')
const imei = ref<string>('')
const result = ref<string>('')

const style = tv({
  slots: {
    input: [
      'w-full bg-white/70 dark:bg-zinc-900/60',
      'border border-zinc-200 dark:border-zinc-700',
      'rounded-xl px-4 py-3 text-base text-zinc-800 dark:text-zinc-100',
      'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-2 focus:ring-primary/70 focus:border-primary',
      'hover:shadow-sm hover:border-primary/40'
    ],
  },
})

const b = style()

async function handleClick() {
  if(!orderNo.value || !imei.value) {
    return toast.warning(t('store.prompt.searchOrder'))
  }
  const params: OrderSearchParams = {
    orderNumber: orderNo.value,
    imei: imei.value
  }
  const { data } = await orderSearch(params)
  result.value = data
}
</script>

<template>
  <div class="w-full flex flex-col">
    <TheGlobalBack :name="t('store.tool.title.order')" />
    <div class="px-4 flex flex-col mt-8">
      <div class="flex flex-col space-y-5">
        <input
          :class="b.input()"
          :placeholder="t('store.search.order.no')"
          v-model="orderNo" />
        <input
          :class="b.input()"
          placeholder="IMEI / SN"
          v-model="imei" />

        <div class="flex justify-center mt-2">
          <XButton
            class="w-full sm:w-1/2 h-12 sm:text-lg font-medium tracking-wide shadow-sm hover:shadow-md transition"
            :label="t('store.search.button')"
            @click="handleClick"
          />
        </div>
      </div>

      <!-- <div class="flex items-center text-sm text-zinc-400 dark:text-zinc-500 gap-3 mt-10">
        <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
        <span>查询结果将在这里展示</span>
        <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
      </div> -->

      <div class="mt-6 bg-white/60 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700 p-6 text-center text-zinc-500 dark:text-zinc-400 shadow-sm">
        <span v-if="result" v-html="result"></span>
        <span v-else>{{ t('store.search.null') }}</span>
      </div>
    </div>
  </div>
</template>
