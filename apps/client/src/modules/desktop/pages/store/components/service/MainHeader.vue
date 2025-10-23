<script setup lang="ts">
import StoreService from './StoreService.vue'

import type { ClassNameValue } from 'tailwind-merge'

import { SERVICE_STORE } from '@desktop/pages/store/utils/symbol'
import { debounce } from '@3un/utils'

interface MainProps {
  class?: ClassNameValue,
}

const store = inject(SERVICE_STORE)!

const props = defineProps<MainProps>()

const name = ref<string>('')

const { t } = useI18n()

const groups = computed(() => {
  return Array.from(store.groupMap, ([key, value]) => ({id: key, title: value}))
})

const services = computed(() => {
  if(store.serviceSearch.groupId === -1) {
    return []
  }
  const services = store.groupServiceMap.get(store.serviceSearch.groupId!)
  return services?.map(service => ({ serviceId: service.id, name: service.title }))!
})
</script>

<template>
  <section class="flex items-center space-x-2" :class="props.class">
    <StoreService
      v-model:group="store.serviceSearch.groupId!" v-model:service="store.serviceSearch.serverId!"
      :groups :services
    />


  </section>
</template>
