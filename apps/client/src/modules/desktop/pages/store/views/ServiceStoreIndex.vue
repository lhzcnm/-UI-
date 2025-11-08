<script setup lang="ts">
import MainContainer from '../components/service/MainContainer.vue'
import ServiceGroupSel from '../components/service/ServiceGroupSel.vue'

import type { ServiceParams } from '@/api/store/types'
import { SERVICE_STORE } from '../utils/symbol'
import { storeAuth, storeServices } from '@/api/store'
import { debounce } from '@3un/utils'

const store = inject(SERVICE_STORE)!

const name = ref<string>('')

const { t } = useI18n()

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

async function doStoreAuth() {
  const key = import.meta.env.VITE_GUEST_TOKEN
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
  <div class="h-full w-full flex flex-col">
    <main class="h-full w-full flex flex-col space-y-6 relative z-10 p-4">
      <section
        class="bg-white dark:bg-black rounded-xl p-4 flex flex-col space-y-6">
        <input
          type="text"
          :placeholder="t('store.search.service.name')"
          v-model="name"
          class="w-full px-4 py-3 text-base rounded-lg border border-zinc-200 dark:border-zinc-700
                 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary
                 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          @input="handleInput"/>
        <div class="flex">
          <div class="min-w-36 border-r flex justify-center items-center">
            <span class="">{{ t('store.search.group') }}</span>
          </div>
          <div class="flex flex-wrap gap-2 p-2">
            <button
              class="transition-all duration-200 select-none font-medium
                px-4 py-2 rounded-full border
                bg-zinc-100 dark:bg-zinc-900
                hover:bg-zinc-200 dark:hover:bg-zinc-800
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-primary/50"
              :class="{ 'border-primary': store.serviceSearch.groupId === -1 }"
              @click="store.serviceSearch.groupId = -1">
              {{ t('all') }}
            </button>
            <template v-for="[key, value] in store.groupMap" :key="key">
              <ServiceGroupSel
                :class="[store.serviceSearch.groupId === key && 'border-primary' ]"
                v-model="store.serviceSearch.groupId!"
                :id="key" :name="value"
              />
            </template>
          </div>
        </div>
      </section>
      <section
        ref="serviceContainer"
        class="flex-1 overflow-y-auto transition-all bg-white dark:bg-black rounded-xl p-4" style="scrollbar-width: none;">
        <MainContainer />
      </section>
    </main>
  </div>
</template>
