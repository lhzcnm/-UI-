<script setup lang="ts">
import TheStoreHeader from './components/TheStoreHeader.vue'

import { MARKET_STORE, type MarketStore } from './utils/symbol'

const store = reactive<MarketStore>({
  services: [],

  groupId: -1,
  serviceId: -1,
})

watch(
  [() => store.groupId, () => store.serviceId],
  async () => await getServiceItem(store.serviceId)
)

async function getServiceItem(serviceId: number) {
  console.log(serviceId)
}

provide(MARKET_STORE, store)
</script>

<template>
  <div class="h-screen">
    <TheStoreHeader />
    <main class="py-2 h-store-container">

    </main>
  </div>
</template>
