<script setup lang="ts">
import ServiceStoreIndex from './views/ServiceStoreIndex.vue'
import ServiceDetailIndex from './views/ServiceDetailIndex.vue'
import TheGlobalTool from './components/TheGlobalTool.vue'

import type { ServiceItem } from '@/api/store/types'
import {SERVICE_STORE, type ServiceStore } from './utils/symbol'

const store = reactive<ServiceStore>({
  visibleConfirm: false,
  visibleQrcode: false,
  visibleTool: false,

  services: [],
  // groups: [],
  serviceMap: new Map<number, ServiceItem>(),
  groupMap: new Map<number, string>(),
  groupServiceMap: new Map<number, ServiceItem[]>(),

  serviceSearch: {
    serverId: -1,
    groupId: -1,
    serverName: '',
  },

  imeiList: [],

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

  userInfo: null,

  url: '',

  storeStatus: 'serviceStore',

  payType: 'wxpay',

  rawOrder: [],
})

provide(SERVICE_STORE, store)

function defineComponentMap<T extends Record<string, Component>>(map: T) {
  return map
}

const component = defineComponentMap<Record<string, Component>>({
  serviceStore: ServiceStoreIndex,
  serviceDetail: ServiceDetailIndex,
})

onBeforeUnmount(() => {
  localStorage.clear()
})
</script>

<template>
  <div class="h-screen pb-2 flex flex-col space-y-4">
    <main class="h-full px-32 flex flex-col items-center justify-center">
      <div class="absolute inset-0 pointer-events-none bg-[linear-gradient(180.00deg,rgba(185,251,255,1),rgba(209,201,241,1)100%)] dark:bg-[linear-gradient(180deg,#0f2027,#203a43,#2c5364)] opacity-20 overflow-hidden z-0">
      </div>

      <component :is="component[store.storeStatus]" />
    </main>
    <TheGlobalTool v-model="store.visibleTool" />
  </div>
</template>
