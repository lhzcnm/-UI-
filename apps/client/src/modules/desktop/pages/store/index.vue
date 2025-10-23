<script setup lang="ts">
import TheStoreHeader from './components/TheStoreHeader.vue'
import ServiceStoreIndex from './views/ServiceStoreIndex.vue'

import type { ServiceItem } from './api/types'
import { SERVICE_STORE, type ServiceStore } from './utils/symbol'
import ServiceDetailIndex from './views/ServiceDetailIndex.vue'
import type { Component } from 'vue'

const store = reactive<ServiceStore>({
  visibleConfirm: false,
  visibleQrcode: false,

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
})

provide(SERVICE_STORE, store)

function defineComponentMap<T extends Record<string, Component>>(map: T) {
  return map
}

const component = defineComponentMap<Record<string, Component>>({
  serviceStore: ServiceStoreIndex,
  serviceDetail: ServiceDetailIndex,
})
</script>

<template>
  <div class="h-screen pb-2 flex flex-col space-y-4">
    <TheStoreHeader />
    <main class="overflow-y-auto h-store-container px-32 flex flex-col">
      <component :is="component[store.storeStatus]" />
    </main>
  </div>
</template>
