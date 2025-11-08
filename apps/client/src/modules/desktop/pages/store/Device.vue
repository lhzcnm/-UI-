<script setup lang="ts">
import DeviceCard from '@/components/card/DeviceCard.vue'
import DeviceCategory from './components/device/DeviceCategory.vue'
import DeviceHeader from './components/device/DeviceHeader.vue'
// import TheStoreHeader from './components/TheStoreHeader.vue'

import { deviceCategorys, products } from './utils/device'
import { DEVICE_STORE, type DeviceStore } from './utils/symbol'

const store = reactive<DeviceStore>({
  visibleChart: false,

  selectCategory: 0,
})

provide(DEVICE_STORE, store)

const deviceProducts = computed(() => {
  let res = products

  if(store.selectCategory !== 0) {
    res = res.filter(item => item.category === store.selectCategory)
  }

  return res
})
</script>

<template>
  <div class="flex flex-col">
    <!-- <TheStoreHeader /> -->
    <main
      class="max-w-7xl md:max-w-[80%] mx-auto px-4 py-8">
      <section>
        <DeviceHeader />
        <DeviceCategory :categorys="deviceCategorys" v-model="store.selectCategory" />
      </section>
  
      <section class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DeviceCard
          v-for="product in deviceProducts" :key="product.id"
          :product="product"
        />
      </section>
    </main>
  </div>
</template>
