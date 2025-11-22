<script setup lang="ts">
import MainContainer from './components/MainContainer.vue'
import ServiceGroupSel from './components/ServiceGroupSel.vue'
import TheGlobalTool from './components/TheGlobalTool.vue'

import { watchOnce } from '@vueuse/core'

import { zServiceParams, type Service, type ServiceParams } from '@/inters/services'
import { SERVICE_STORE, type ServiceStore } from './utils'
import { getServices } from '@/api/shop'
import { debounce } from '@3un/utils'

const store: ServiceStore = reactive({
  visibleTool: false,

  services: [],
  serviceMap: new Map<number, Service>(),
  groupMap: new Map<number, string>(),
  groupServiceMap: new Map<number, Service[]>(),

  searchForm: zServiceParams.parse({}),

})

provide(SERVICE_STORE, store)

const keyword = ref<string>('')

const { t } = useI18n()

watch(
  () => store.searchForm,
  async (params) => {
    await getServiceList(params)
  },
  {
    immediate: true,
    deep: true,
  }
)

async function getServiceList(params: ServiceParams) {
  const data = await getServices(params)
  store.services = data
}

const handleInput = debounce(() => {
  store.searchForm.serverName = keyword.value
})

// await getServiceList(store.searchForm)

onMounted(() => {
  watchOnce(
    () => store.services,
    () => {
      console.log(store.services)
      for(let item of store.services) {
        store.groupMap.set(item.id, item.title)
        store.groupServiceMap.set(item.id, item.children)
    
        for(let service of item.children) {
          store.serviceMap.set(service.id, service)
        }
      }
    },
  )
})
</script>

<template>
  <div class="h-full w-full xl:w-[60vw] flex flex-col ">
    <main class="w-full flex flex-col space-y-6 relative z-10 p-4 px-32">
      <section
        class="bg-white dark:bg-black rounded-xl p-4 flex flex-col space-y-6 sticky top-0 z-20">
        <input
          type="text"
          :placeholder="t('shop.search.service.name')"
          v-model="keyword"
          class="w-full px-4 py-3 text-base rounded-lg border border-zinc-200 dark:border-zinc-700
                 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary
                 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          @input="handleInput"/>
        <div class="flex">
          <div class="min-w-36 border-r flex justify-center items-center">
            <span class="">{{ t('shop.search.group') }}</span>
          </div>
          <div class="flex flex-wrap gap-2 p-2 max-h-20 overflow-y-auto" style="scrollbar-width: none;">
            <button
              class="transition-all duration-200 select-none font-medium
                px-4 py-2 rounded-full border
                bg-zinc-100 dark:bg-zinc-900
                hover:bg-zinc-200 dark:hover:bg-zinc-800
                active:scale-95
                focus:outline-none focus:ring-2 focus:ring-primary/50"
              :class="{ 'border-primary': !store.searchForm.groupId }"
              @click="store.searchForm.groupId = undefined">
              {{ t('all') }}
            </button>
            <template v-for="[key, value] in store.groupMap" :key="key">
              
              <ServiceGroupSel
                :class="[store.searchForm.groupId === key && 'border-primary' ]"
                v-model="store.searchForm.groupId!"
                :id="key" :name="value"
              />
            </template>
          </div>
        </div>
      </section>
      <section
        ref="serviceContainer"
        class="flex-1 transition-all bg-white dark:bg-black rounded-xl p-4 bg-opacity-50 dark:bg-opacity-50"
        style="scrollbar-width: none;">
        <MainContainer />
      </section>
    </main>

    <TheGlobalTool v-model="store.visibleTool" />
  </div>
</template>
