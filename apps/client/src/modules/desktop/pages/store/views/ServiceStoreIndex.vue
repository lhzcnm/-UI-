<script setup lang="ts">
import MainContainer from '../components/service/MainContainer.vue'

import type { ServiceParams } from '@/api/store/types'
import { SERVICE_STORE } from '../utils/symbol'
import { storeAuth, storeServices } from '@/api/store'

const store = inject(SERVICE_STORE)!

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
  const { data } = await storeServices(params)

  store.services = data
}

// async function getUserInfo() {
//   try {
//     const { data } = await userApi.info()

//     store.userInfo = data
//   } catch {
//     return
//   }
// }

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
  <div class="h-full flex flex-col">
    <main class="h-full flex space-x-6 relative z-10 p-4">
      <section
        ref="serviceContainer"
        class="flex-1 p-6 overflow-y-auto rounded-2xl transition-all" style="scrollbar-width: none;">
        <MainContainer />
      </section>
    </main>
  </div>
</template>
