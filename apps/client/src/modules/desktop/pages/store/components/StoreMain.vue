<script setup lang="ts">
import StoreService from './StoreService.vue'

import type { ServiceItem } from '../api/types'
import type { Service } from '@/api/services'
import { MARKET_STORE } from '../utils/symbol'
import StoreCard from './card/StoreCard.vue'

const store = inject(MARKET_STORE)!

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

function handleSubmit(id: number) {
  store.selectService = store.serviceMap.get(id)!
  store.visibleOrder = true
} 
</script>

<template>
  <div class="mx-32">
    <section class="flex space-x-2">
      <StoreService
        v-model:group="store.groupId" v-model:service="store.serviceId"
        :groups :services
      />
      <XInput placeholder="请输入关键词" />
    </section>

    <section class="mt-4 space-y-8">
      <div
        v-for="group in store.services"
        :key="group.id"
        class="space-y-4"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold tracking-tight">{{ group.title }}</h2>
        </div>
        <div
          class="grid gap-4"
          style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));"
        >
          <StoreCard
            v-for="service in group.children"
            :key="service.id"
            :id="service.id"
            :price="service.price"
            :title="service.title"
            :desc="service.mustRead"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </section>
  </div>
</template>
