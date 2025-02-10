<script setup lang="ts">
import SearchOrder from './components/SearchOrder.vue'
import ExportOrder from './components/ExportOrder.vue'
import type { ColDef } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'

import { theme } from '@/utils/table'
import orderApi from '@/api/orders'

import type { HistoryStore } from './utils'
import { HISTORY_STORE, form, getSearchOrderParams } from './utils'
import { defaultColumns } from './defaultColumns'

const page = ref(1)
const pageSize = ref(20)

const columns = ref<ColDef[]>(defaultColumns)
const store: HistoryStore = reactive({
  orders: { list: [], page: 1, total: 0, pageSize: 20 },
  searchForm: { ...form.search },
  exportForm: { ...form.export },
  visibleSearch: false,
  visibleExport: false,
})

provide(HISTORY_STORE, store)

watch(
  [page, pageSize],
  async ([pageVal, pageSizeVal]) => {
    const params = getSearchOrderParams(store.searchForm)

    const response = await orderApi.list({
      pageSize: pageSizeVal,
      page: pageVal,
      ...params,
    })

    store.orders = response.data
  },
  // { immediate: true },
)

function openSearch() {
  store.searchForm = { ...form.search }
  store.visibleSearch = true
}

function openExport() {
  store.exportForm = { ...form.export }
  store.visibleExport = true
}
</script>

<template>
  <div class="h-full">
    <section class="flex justify-between gap-2 mb-3">
      <div class="flex items-center gap-2">
        <XButton label="搜索" @click="openSearch" />
        <XButton variant="success" label="导出" @click="openExport" />
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

    <AgGridVue
      :theme="theme"
      :rowData="store.orders.list"
      :columnDefs="columns"
      class="h-[calc(100%-48px)]"
    />

    <SearchOrder />
    <ExportOrder />
  </div>
</template>
