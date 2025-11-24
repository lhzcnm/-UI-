<script setup lang="ts">
import SelectService from '@mobile/components/SelectService.vue'

import { tv } from 'tailwind-variants'

import { useShopStore } from '@/stores/shop'
// import { orderSearch } from '@/api/shop'

const { t } = useI18n()

const shopStore = useShopStore()
const router = useRouter()
const route = useRoute()

const orderNo = ref<string>()
const imei = ref<string>()

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

watch(
  () => shopStore.historySearch,
  () => {
    console.log(shopStore.historySearch)
  },
  {
    deep: true
  }
)

async function handleClick() {
  shopStore.historySearch = {
    ...shopStore.historySearch,
    imeiList: imei.value?.split('\n') || undefined,
    codeIdList: orderNo.value?.split('\n') || undefined,
  }

  // console.log(shopStore.historySearch)
  // const data = await orderSearch(shopStore.historySearch)
  // shopStore.historys = data

  if(route.path !== "/shop/history") {
    router.push("/shop/history")
  }
}
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="px-4 flex flex-col mt-8">
      <div class="flex flex-col space-y-5">
        <SelectService class="flex flex-col space-y-3" v-model:group="shopStore.historySearch.groupId" v-model="shopStore.historySearch.serviceId" />
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
    </div>
  </div>
</template>
