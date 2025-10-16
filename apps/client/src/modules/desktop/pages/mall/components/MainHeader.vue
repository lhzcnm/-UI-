<script setup lang="ts">
import StoreService from './StoreService.vue'

import type { ClassNameValue } from 'tailwind-merge'

import type { Service } from '@/api/services'
import { MARKET_STORE } from '../utils/symbol'

interface MainProps {
  class?: ClassNameValue,
}

const store = inject(MARKET_STORE)!

const props = defineProps<MainProps>()

const { t } = useI18n()

const groups = computed(() => {
  // return store.services.map(item => ({ id: item.id, title: item.title }))
  return Array.from(store.groupMap, ([key, value]) => ({id: key, title: value}))
})

const services = computed(() => {
  if(store.serviceSearch.groupId === -1) {
    return []
  }

  const category = store.services.find(item => item.id === store.serviceSearch.groupId)

  if(!category?.children.length) {
    return []
  }

  const children: Service[] = category.children
  return children.map(item => ({ serviceId: item.id, name: item.title }))
})
</script>

<template>
  <section class="flex space-x-2" :class="props.class">
    <StoreService
      v-model:group="store.serviceSearch.groupId!" v-model:service="store.serviceSearch.serverId!"
      :groups :services
    />
    <XInput v-model="store.serviceSearch.serverName" :placeholder="t('keyword.placeholder')" />
  </section>
</template>
