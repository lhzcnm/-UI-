<script setup lang="ts">
import ServiceView from './views/ServiceView.vue'
import ProfileView from './views/ProfileView.vue'
import ServiceDetail from './views/ServiceDetail.vue'

import type { ServiceItem, ServiceParams } from '@/api/store/types'
import { storeAuth, storeServices } from '@/api/store'
import { SERVICE_STORE, type ServiceStore } from './utils/symbol'

const store = reactive<ServiceStore>({
  visibleFilter: false,
  submited: false,

  groupMap: new Map<number, string>,
  groupServiceMap: new Map<number, ServiceItem[]>,
  serviceMap: new Map<number, ServiceItem>,

  serviceSearch: {
    serverId: -1,
    groupId: -1,
    serverName: '',
  },
  services: [],
  selService: null,
  
  createOrder: {
    serviceId: '-1',
    groupId: -1,
    imeiList: [],
    isBulk: true,
    isPushNotification: true,
    phoneNumber: '',
    email: '',
  },

  payType: 'wxpay',

  storeStatus: 'service',

  storeType: 'all',

  displayMode: 'flex',
})

provide(SERVICE_STORE, store)

async function doStoreAuth() {
  const key = import.meta.env.VITE_GUEST_TOKEN
  if(localStorage.getItem(key)) return

  const { data } = await storeAuth()
  localStorage.setItem(key, data)
}

async function getServices() {
  const params: ServiceParams = {
    serverId: store.serviceSearch.serverId !== -1 ? store.serviceSearch.serverId : undefined,
    groupId: store.serviceSearch.groupId !== -1 ? store.serviceSearch.groupId : undefined,
    serverName: store.serviceSearch.serverName ? store.serviceSearch.serverName : undefined,
  }

  store.services.length = 0
  const { data } = await storeServices(params)

  store.services = data
}

await Promise.all([
  doStoreAuth(),
  getServices(),
])

function defineComponentMap<T extends Record<string, Component>>(map: T) {
  return map
}

const component = defineComponentMap<Record<string, Component>>({
  service: ServiceView,
  profile: ProfileView,
  detail: ServiceDetail,
})

onMounted(() => {
  store.serviceMap.clear()
  store.groupMap.clear()

  for(const item of store.services) {
    store.groupMap.set(item.id, item.title)
    store.groupServiceMap.set(item.id, item.children)
    for(const service of item.children) {
      store.serviceMap.set(service.id, service)
    }
  }
})
</script>

<template>
  <div class="size-full flex flex-col">
    <main class="h-full flex flex-col">
      <Transition name="slide-right">
        <component :is="component[store.storeStatus]" />
      </Transition>
    </main>
  </div>
</template>
