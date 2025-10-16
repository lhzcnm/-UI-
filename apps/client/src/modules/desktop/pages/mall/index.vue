<script setup lang="ts">
import TheStoreHeader from './components/TheStoreHeader.vue'
import ServiceDetail from './components/ServiceDetail.vue'
import MainContainer from './components/MainContainer.vue'
import OrderDialog from './components/OrderDialog.vue'
import MainHeader from './components/MainHeader.vue'

import { EMAIL_REG, IMEI_TYPE_MAP, PHONE_REG } from '@3un/utils'
import { toast } from 'vue-sonner'

import { MARKET_STORE, type MarketStore } from './utils/symbol'
import { type Service } from '@/api/services'
import { validate, type ValidRule } from '@/utils'
import { storeAuth, storeServices } from './api'
import type { ServiceParams } from './api/types'

const store = reactive<MarketStore>({
  visibleOrder: false,
  visibleDetail: false,

  services: [],
  serviceMap: new Map<number, Service>(),
  groupMap: new Map<number, string>(),

  serviceSearch: {
    serverId: -1,
    groupId: -1,
    serverName: '',
  },

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
    storePrice: '0.00',
    taken: '',
    imeiType: 5,
    mustRead: '',
    isNew: false,
    isHot: false,
    isUnlock: false,
  },
})

provide(MARKET_STORE, store)

const { t } = useI18n()

const serviceContainer = ref<HTMLElement | null>(null)

watch(
  () => store.serviceSearch,
  async () => await getServices(),
  {
    deep: true,
  }
)

async function getServices() {
  const params: ServiceParams = {
    serverId: store.serviceSearch.serverId !== -1 ? store.serviceSearch.serverId : undefined,
    groupId: store.serviceSearch.groupId !== -1 ? store.serviceSearch.groupId : undefined,
    serverName: store.serviceSearch.serverName ? store.serviceSearch.serverName : undefined,
  }

  store.services.length = 0
  store.serviceMap.clear()

  const { data } = await storeServices(params)
  store.services = data
}

function handleConfirm() {
  if(!store.createOrder.imei) {
    return toast.warning(t('valid.store.imeiNull'))
  }

  if(store.createOrder.pushRes) {
    if(!store.createOrder.phone && !store.createOrder.mail) {
      return toast.warning(t('store.valid.pushType'))
    }
  }

  const rules: ValidRule[] = [
    {
      rule: IMEI_TYPE_MAP[store.selectService.imeiType].regex.test(store.createOrder.imei),
      message: "请输入正确的imei/sn",
    },
  ]

  if(store.createOrder.phone) {
    rules.push({
      rule: PHONE_REG.test(store.createOrder.phone),
      message: t('valid.invalid', { field: t('store.form.phone') }),
    })
  }

  if(store.createOrder.mail) {
    rules.push({
      rule: EMAIL_REG.test(store.createOrder.mail),
      message: t('valid.invalid', { field: t('store.form.mail') }),
    })
  }

  if(!validate(rules)) return
}

async function doStoreAuth() {
  const key = import.meta.env.VITE_ACCESS_TOKEN
  if(localStorage.getItem(key)) return

  const { data } = await storeAuth()
  localStorage.setItem(key, data)
}

await Promise.all([
  doStoreAuth(),
  getServices(),
])

onMounted(() => {
  const order = localStorage.getItem('order')

  if(order) {
    console.log('continue order')
  }

  for(const item of store.services) {
    store.groupMap.set(item.id, item.title)
    for(const service of item.children) {
      store.serviceMap.set(service.id, service)
    }
  }
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <TheStoreHeader />

    <main class="py-4 h-store-container flex flex-col">
      <MainHeader class="px-32" />
      <section
        ref="serviceContainer"
        class="flex-1 mt-4 space-y-4 px-32 overflow-y-auto">
        <MainContainer />
      </section>
    </main>

    <OrderDialog @confirm="handleConfirm" />
    <ServiceDetail :desc="store.selectService.mustRead" />
  </div>
</template>
