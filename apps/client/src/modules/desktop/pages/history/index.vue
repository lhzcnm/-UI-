<script setup lang="ts">
import SearchOrder from './components/SearchOrder.vue'
import ExportOrder from './components/ExportOrder.vue'
import { XButton } from '@3un/ui'

import type { HistoryStore } from './utils'
import { HISTORY_STORE, form, formatOrderParams } from './utils'
import { columns } from './utils/columns'
import { orderApi } from '@/api/orders'

const serviceStore = useServiceStore()
const page = ref(1)
const pageSize = ref(20)

const store: HistoryStore = reactive({
  orders: { list: [], page: 1, total: 0, pageSize: 20 },
  searchForm: { ...form.search },
  exportForm: { ...form.export },
  visibleSearch: false,
  visibleExport: false
})

provide(HISTORY_STORE, store)

await serviceStore.getServices()

watch(
  [page, pageSize],
  async ([pageVal, pageSizeVal]) => {
    const params = formatOrderParams(store.searchForm)
    const response = await orderApi.list({
      pageSize: pageSizeVal,
      page: pageVal,
      ...params,
    })
    store.orders = response.data
  },
  { immediate: true }
)

function openSearch() {
  store.visibleSearch = true
}

function openExport() {
  store.exportForm = { ...form.export }
  store.visibleExport = true
}
</script>

<template>
  <div class="p-4 h-full">
    <section class="flex justify-between space-x-2 mb-3">
      <div class="space-x-2 whitespace-nowrap">
        <XButton label="搜索" @click="openSearch" />
        <XButton color="emerald" label="导出" @click="openExport" />
      </div>

      <XPagination
        v-model="page"
        v-model:size="pageSize"
        :total="store.orders.total"
        :layouts="[
          'total',
          'sizes',
          'prev',
          'pager',
          'next',
          'jumper',
        ]"
      />
    </section>

    <XTable
      :data="store.orders.list"
      :columns="columns"
      row-key="id"
      class="h-[calc(100%-3rem)]"
    />

    <SearchOrder />
    <ExportOrder />
  </div>
</template>
