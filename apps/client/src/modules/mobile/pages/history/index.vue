<script setup lang="ts">
import SearchOrder from './components/SearchOrder.vue'
import ExportOrder from './components/ExportOrder.vue'
import { twJoin } from 'tailwind-merge'

import type { HistoryStore } from './utils'
import { HISTORY_STORE, form, formatOrderParams } from './utils'
import { orderApi } from '@/api/orders'

const serviceStore = useServiceStore()
await serviceStore.getServices()

const page = ref(1)
const pageSize = ref(20)

const mainNode = document.getElementById('main')

const store: HistoryStore = reactive({
  orders: form.orders,
  searchForm: { ...form.search },
  exportForm: { ...form.export },
  visibleSearch: false,
  visibleExport: false,
})

provide(HISTORY_STORE, store)

watch(
  page,
  async (pageVal) => {
    const params = formatOrderParams(store.searchForm)

    const response = await orderApi.list({
      serviceId: store.searchForm.serviceId || undefined,
      pageSize: pageSize.value,
      page: pageVal,
      ...params,
    })

    mainNode?.scrollTo({ top: 0, behavior: 'smooth' })
    store.orders = response.data
  },
  { immediate: true },
)
</script>

<template>
  <div class="p-3">
    <section
      :class="twJoin(
        'sticky top-1 z-10',
        'flex items-center justify-between',
        'bg-card border rounded-lg p-3',
      )"
    >
      <div class="space-x-2">
        <XButton label="搜索" @click="store.visibleSearch = true" />
        <XButton label="导出" color="success" @click="store.visibleExport = true" />
      </div>

      <XSimplePagination
        v-model="page"
        :page-size="pageSize"
        :total="store.orders.total"
      />
    </section>

    <section class="space-y-3 my-3">
      <NoMessage
        v-if="store.orders.list.length === 0"
        class="bg-card border rounded-lg p-3"
      />
      <template v-else>
        <OrderCard
          v-for="order in store.orders.list"
          :key="order.id" :order="order"
        />
      </template>
    </section>

    <SearchOrder />
    <ExportOrder />
  </div>
</template>
