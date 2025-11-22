<script setup lang="ts">
import TheGlobalBack from './TheGlobalBack.vue'
import SelectService from '../components/SelService.vue'

import { tv } from 'tailwind-variants'

import { useShopStore } from '@/stores/shop'
import { orderSearch } from '@/api/shop'
import { SERVICE_STORE } from '../utils'

const { t } = useI18n()

const store = inject(SERVICE_STORE)!
const shopStore = useShopStore()
const router = useRouter()
const route = useRoute()

const orderNo = ref<string>()
const imei = ref<string>()
const serviceId = ref<number>(0)

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
  shopStore.historySearch = {
    ...shopStore.historySearch,
    serviceId: serviceId.value === 0 ? undefined : serviceId.value,
    imeiList: imei.value?.split('\n') || undefined,
    codeIdList: orderNo.value?.split('\n') || undefined,
  }

  const data = await orderSearch(shopStore.historySearch)
  shopStore.historys = data

  if(route.path !== "/shop/history") {
    router.push("/shop/history")
  }
}
</script>

<template>
  <div class="w-full flex flex-col">
    <TheGlobalBack :name="t('shop.tool.title.order')" />
    <div class="px-4 flex flex-col mt-8">
      <div class="flex flex-col space-y-5">
        <SelectService :class="[b.input(), 'h-12 sm:h-16']" v-model="serviceId" :services="store.services" />
        <textarea
          :class="b.input()"
          :placeholder="t('shop.search.order.no')"
          v-model="orderNo" />
        <textarea
          :class="b.input()"
          placeholder="IMEI / SN"
          v-model="imei" />

        <div class="flex justify-center mt-2">
          <XButton
            class="w-full h-12 sm:text-lg font-medium tracking-wide shadow-sm hover:shadow-md transition"
            :label="t('shop.search.button')"
            @click="handleClick"
          />
        </div>
      </div>

      <!-- <div class="flex items-center text-sm text-zinc-400 dark:text-zinc-500 gap-3 mt-10">
        <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
        <span>查询结果将在这里展示</span>
        <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
      </div> -->

      <!-- <div class="mt-6 bg-white/60 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-700 p-6 text-center text-zinc-500 dark:text-zinc-400 shadow-sm">
        <span v-if="result" v-html="result"></span>
        <span v-else>{{ t('store.search.null') }}</span>
      </div> -->
    </div>
  </div>
</template>
