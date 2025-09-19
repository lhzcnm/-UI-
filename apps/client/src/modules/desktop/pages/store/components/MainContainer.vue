<script setup lang="ts">
import StoreCard from './card/StoreCard.vue'

// import type { ServiceDetail } from '@/api/services'
// import type { ServiceGroup } from '../api/types'
import { MARKET_STORE } from '../utils/symbol'

const store = inject(MARKET_STORE)!

function handleSubmit(id: number) {
  store.selectService = store.serviceMap.get(id)!
  store.visibleOrder = true
}

function handleView(id: number) {
  store.selectService = store.serviceMap.get(id)!
  store.visibleDetail = true
}
</script>

<template>
  <div
    v-for="group in store.services"
    :key="group.id"
    class="space-y-2"
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
        @view="handleView"
      />
    </div>
  </div>
</template>
