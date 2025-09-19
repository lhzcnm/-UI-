<script setup lang="ts">
import StoreService from './StoreService.vue'

import type { Service } from '@/api/services'
import { MARKET_STORE } from '../utils/symbol'

const store = inject(MARKET_STORE)!

const { t } = useI18n()

const groups = computed(() => {
  return store.services.map(item => ({ id: item.id, title: item.title }))
})

const services = computed(() => {
  if(store.groupId === -1) {
    return []
  }

  const children: Service[] = store.services.find(item => item.id === store.groupId)!.children
  return children.map(item => ({ serviceId: item.id, name: item.title }))
})
</script>

<template>
  <section class="flex space-x-2">
    <StoreService
      v-model:group="store.groupId" v-model:service="store.serviceId"
      :groups :services
    />
    <XInput :placeholder="t('keyword.placeholder')" />
  </section>
</template>
