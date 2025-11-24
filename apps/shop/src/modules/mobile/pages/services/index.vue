<script setup lang="ts">
import TheServiceHeader from '@mobile/components/TheServiceHeader.vue'
import SlideRight from '@mobile/components/SlideRight.vue'
import ServiceDetail from './components/ServiceDetail.vue'

import { tv } from 'tailwind-variants'

import { SERVICE_STORE, type ServiceStore } from './utils'
import type { Service } from '@/inters/services'
import type { ShopType, DisplayMode } from '@mobile/utils/types'
import { zSubmitParams } from '@/inters/order'

const store: ServiceStore = reactive({
  visibleFilter: false,
  visibleDetail: false,
  visiblePay: false,
  submited: false,

  createOrder: zSubmitParams.parse({}),
  url: ""
})

provide(SERVICE_STORE, store)

const shopStore = useShopStore()

const displayMode = ref<DisplayMode>("flex")
const shopType = ref<ShopType>("all")
const keyword = ref<string>("")

const services = computed(() => {
  let res: Service[] = shopStore.services.flatMap(group => group.children)

  switch(shopType.value) {
    case "hot":
      res = res.filter(service => service.isHot)
      break
    case "new":
      res = res.filter(service => service.isNew)
      break
  }

  if(keyword.value) {
    res = res.filter(item => item.title.includes(keyword.value))
  }

  return res
})

function handleClick(id: number) {
  shopStore.selService = shopStore.servicesMap.get(id)
  store.visibleDetail = true
}

const style = tv({
  slots: {
    root: [
      'h-full w-full flex flex-col',
    ],
    main: [
      'bg-white dark:bg-black rounded-t-xl flex-1 px-4 py-2 overflow-y-auto',
    ],
    displayFlex: [
      'flex flex-col space-y-4',
    ],
    displayGrid: [
      'grid grid-cols-2 gap-x-2 gap-y-4',
    ],
  },
  defaultVariants: {
    displayMode: 'flex',
  },
})

const b = style()
</script>

<template>
  <div :class="b.root()">
    <section class="pt-2">
      <TheServiceHeader
        v-model="displayMode" v-model:type="shopType" v-model:input="keyword" />
    </section>
    <section
      :class="[
        b.main(),
        displayMode === 'flex' && b.displayFlex(),
        displayMode === 'grid' && b.displayGrid(),
      ]"
      style="scrollbar-width: none;">
      <StoreCard
        v-for="service in services"
        :key="service.id"
        :id="service.id"
        :price="service.storePrice"
        :desc="service.mustRead"
        :title="service.title"
        class="
          min-w-0 rounded-xl p-4 border border-white/10
          bg-gradient-to-tr max-h-60
          shadow-lg transition-all duration-300
        "
        @submit="handleClick"
      />
    </section>

    <SlideRight
      v-model="store.visibleDetail"
      title="服务详情"
    >
      <ServiceDetail />
    </SlideRight>
  </div>
</template>
