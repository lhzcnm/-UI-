<script setup lang="ts">
import InterceptModal from './components/InterceptModal.vue'
import InterceptCard from './components/InterceptCard.vue'

import { zInterceptForm } from '@/inters/intercept'
import { getIntercepts } from '@/api/intercept'

import type { InterceptStore } from './utils'
import { INTERCEPT_STORE } from './utils'

const store: InterceptStore = reactive({
  intercepts: await getIntercepts(),

  formBase: zInterceptForm.parse({}),
  visibleBase: false,

  index: undefined,
})

provide(INTERCEPT_STORE, store)

function openCreate() {
  store.formBase = zInterceptForm.parse({})
  store.index = undefined
  store.visibleBase = true
}
</script>

<template>
  <div>
    <section class="px-3 py-2 bg-card border-b">
      <XButton
        color="success" icon="lucide:plus"
        label="新增拦截" @click="openCreate"
      />
    </section>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <InterceptCard
        v-for="(item, index) in store.intercepts"
        :key="item.id" :item="item" :index="index"
      />
    </section>

    <InterceptModal />
  </div>
</template>
