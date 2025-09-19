<script setup lang="ts">
import TheStoreHeader from './components/TheStoreHeader.vue'
import OrderDialog from './components/OrderDialog.vue'

import { EMAIL_REG, PHONE_REG } from '@3un/utils'

// import type { ServiceGroup } from './api/types'
import { MARKET_STORE, type MarketStore } from './utils/symbol'
import { serviceApi, type Service } from '@/api/services'
import { toast } from 'vue-sonner'
import { validate, type ValidRule } from '@/utils'
import ServiceDetail from './components/ServiceDetail.vue'
import MainHeader from './components/MainHeader.vue'
import MainContainer from './components/MainContainer.vue'

const store = reactive<MarketStore>({
  visibleOrder: false,
  visibleDetail: false,

  services: [],
  serviceMap: new Map<number, Service>(),

  groupId: -1,
  serviceId: -1,
  createOrder: {
    serviceId: -1,
    price: 0,
    imei: '',
    pushRes: true,
    phone: '',
    mail: '',
  },

  selectService: {
    id: -1,
    parentId: -1,
    title: '',
    price: 0,
    taken: '',
    imeiType: 5,
    mustRead: '',
    isNew: false,
    isHot: false,
    isUnlock: false,
  }
})

provide(MARKET_STORE, store)

watch(
  [() => store.groupId, () => store.serviceId],
  async () => await getServices()
)

async function getServices() {
  const { data } = await serviceApi.list()

  store.services = data

  store.serviceMap.clear()
  for(let item of data) {
    for (let service of item.children) {
      store.serviceMap.set(service.id, service)
    }
  }
}

function handleConfirm() {
  if(store.createOrder.pushRes) {
    if(!store.createOrder.phone && !store.createOrder.mail) {
      return toast.warning('请填写手机号或者邮箱')
    }
  }

  const rules: ValidRule[] = [
    {
      rule: !!store.createOrder.imei,
      message: '请输入imei',
    },
  ]

  if(store.createOrder.phone) {
    rules.push({
      rule: PHONE_REG.test(store.createOrder.phone),
      message: '请输入正确的手机号'
    })
  }

  if(store.createOrder.mail) {
    rules.push({
      rule: EMAIL_REG.test(store.createOrder.mail),
      message: '请输入正确的邮箱号'
    })
  }

  if(!validate(rules)) return
}

await getServices()

onMounted(() => {
  const order = localStorage.getItem('order')

  if(order) {
    console.log('continue order')
  }
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <TheStoreHeader />

    <main class="py-4 h-store-container mx-32 flex flex-col">
      <MainHeader />
      <section
        ref="serviceContainer"
        class="flex-1 mt-4 space-y-4 overflow-y-auto"
        style="scrollbar-width: none;">
        <MainContainer />
      </section>
    </main>

    <OrderDialog @confirm="handleConfirm" />
    <ServiceDetail :desc="store.selectService.mustRead" />
  </div>
</template>
