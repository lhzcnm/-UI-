<script setup lang="ts">
import StoreCard from '@/components/cards/StoreCard.vue'

import type { Service } from '@/inters/services'
import { SERVICE_STORE } from '../utils'

const store = inject(SERVICE_STORE)!

const router = useRouter()

const services = computed(() => {
  let res: Service[] = []

  for(const group of store.services) {
    res.push(...group.children)
  }

  return res
})

function handleSubmit(id: number) {
  router.push({ path: `/shop/detail/${id}` })
  // store.selService = store.serviceMap.get(id)!

  // store.visibleTool = false
}

// function handleView(id: number) {
//   store.selService = store.serviceMap.get(id)!
// }
</script>

<template>
  <div class="space-y-4">
    <div class="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StoreCard
        class="group shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:scale-[1.02] hover:border-primary/30"
        v-for="service in services"
        :key="service.id"
        :id="service.id"
        :price="service.storePrice ?? '0.00'"
        :title="service.title"
        :desc="service.mustRead"
        @submit="handleSubmit"
      />
    </div>
  </div>
</template>
 