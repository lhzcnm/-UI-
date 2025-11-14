<script setup lang="ts">
import TheServiceHeader from '../components/service/TheServiceHeader.vue'

import { tv } from 'tailwind-variants'

import type { ServiceItem } from '@/api/store/types'
import { SERVICE_STORE } from '../utils/symbol'

const store = inject(SERVICE_STORE)!

const services = computed(() => {
  let res: ServiceItem[] = []

  for(const group of store.services) {
    res.push(...group.children)
  }

  return res
})

const style = tv({
  slots: {
    root: [
      'h-full w-full flex flex-col',
    ],
    main: [
      'bg-white dark:bg-black rounded-t-xl flex-1 px-4 py-2 overflow-y-auto',
    ],
    displayFlex: [
      'flex flex-col space-y-4',
    ],
    displayGrid: [
      'grid grid-cols-2 gap-x-2 gap-y-4',
    ],
  },
  defaultVariants: {
    displayMode: 'flex',
  },
})

const b = style()

function handleClick(id: number) {
  store.selService = store.serviceMap.get(id)!

  store.storeStatus = 'detail'
}
</script>

<template>
  <div :class="b.root()">
    <section class="pt-2">
      <TheServiceHeader v-model="store.storeType" />
    </section>
    <section
      :class="[
        b.main(),
        store.displayMode === 'flex' && b.displayFlex(),
        store.displayMode === 'grid' && b.displayGrid(),
      ]"
      style="scrollbar-width: none;">
      <StoreCard
        v-for="service in services"
        :key="service.id"
        :id="service.id"
        :price="service.storePrice"
        :desc="service.mustRead"
        :title="service.title"
        class="
          min-w-0 rounded-xl p-4 border border-white/10
          bg-gradient-to-tr from-blue-50 via-white to-pink-50
          dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-900
          shadow-lg transition-all duration-300
        "
        @submit="handleClick"
      />
    </section>
  </div>
</template>
