<script setup lang="ts">
import TheServiceHeader from '@mobile/components/TheServiceHeader.vue'
import SlideRight from '@mobile/components/SlideRight.vue'
import ServiceDetail from './components/ServiceDetail.vue'

import { tv } from 'tailwind-variants'

import { SERVICE_STORE, type ServiceStore } from './utils'
import type { Service } from '@/inters/services'
import type { ShopType, DisplayMode } from '@mobile/utils/types'
import { zSubmitParams, type SubmitParams } from '@/inters/order'
import { getPaymentStatus } from '@/api/shop'

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
const { t } = useI18n()

const displayMode = ref<DisplayMode>("flex")
const shopType = ref<ShopType>("all")
const keyword = ref<string>("")

const paymentKey = import.meta.env.VITE_PAYMENT_STORAGE
const submitedKey = import.meta.env.VITE_SUBMIT_STORAGE

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

async function getPayment(id: string) {
  const data = await getPaymentStatus(id)
  return data
}

function handleSubmit() {
  const submitedParams = localStorage.getItem(submitedKey) as SubmitParams | null

  if(!submitedParams) {
    localStorage.removeItem(submitedKey)
    localStorage.removeItem(paymentKey)
  }

  shopStore.createOrder = submitedParams!
  location.href = "/shop/history"
}

onMounted(async () => {
  const paymentId = localStorage.getItem(paymentKey)

  if(paymentId !== null) {
    const res = await getPayment(paymentId)
    if(res) {
      handleSubmit()
    } else {
      localStorage.removeItem(paymentKey)
      localStorage.removeItem(submitedKey)
    }
  } else {
    localStorage.removeItem(paymentKey)
  }
})

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
      :title="t('service.detail')"
    >
      <ServiceDetail />
    </SlideRight>
  </div>
</template>
