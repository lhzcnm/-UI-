<script setup lang="ts">
import ServiceGroup from '../components/service/ServiceGroup.vue'
import MainContainer from '../components/service/MainContainer.vue'

import type { ServiceParams } from '../api/types'
import { SERVICE_STORE } from '../utils/symbol'
import { storeAuth, storeServices } from '../api'
import { userApi } from '@/api/user'
import { tv } from 'tailwind-variants'
import { debounce } from '@3un/utils'

const store = inject(SERVICE_STORE)!

const { t } = useI18n()

const name = ref<string>('')

const style = tv({
  slots: {
    background: [
      'absolute inset-0 size-full z-[-2] bg-blur backdrop-blur-sm',
      'bg-gradient-to-b from-blue-50/60 via-white/80 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950',
    ],
  }
})

const b = style()

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

async function getUserInfo() {
  try {
    const { data } = await userApi.info()

    store.userInfo = data
  } catch {
    return
  }
}

async function doStoreAuth() {
  const key = import.meta.env.VITE_ACCESS_TOKEN
  if(localStorage.getItem(key)) return

  const { data } = await storeAuth()
  localStorage.setItem(key, data)
}

const handleInput = debounce(() => {
  store.serviceSearch.serverName = name.value
})

await Promise.all([
  doStoreAuth(),
  getServices(),
  getUserInfo(),
])

onMounted(() => {
  // const order = localStorage.getItem('order')

  // if(order) {
  //   console.log('continue order')
  // }
  store.serviceMap.clear()

  for(const item of store.services) {
    store.groupMap.set(item.id, item.title)
    store.groupServiceMap.set(item.id, item.children)
    for(const service of item.children) {
      store.serviceMap.set(service.id, service)
    }
  }

  window.addEventListener('popstate', (e) => {
    e.preventDefault()

    store.storeStatus = "serviceStore"
  })
})
</script>

<template>
  <div :class="b.background()"></div>
  <div class="h-full flex flex-col">
    <main class="h-full flex space-x-4">
      <section class="w-72 h-full p-2 border border-primary rounded-xl flex flex-col">
        <div class="p-2 flex-1">
          <XInput ui-root="mr-2 rounded-xl" v-model="name" :placeholder="t('keyword.placeholder')" @input="handleInput" />
        </div>
        <serviceGroup />
      </section>
      <section
        ref="serviceContainer"
        class="flex-1 p-4 md:p-6 overflow-y-auto">
        <MainContainer />
      </section>
    </main>
  </div>
</template>
