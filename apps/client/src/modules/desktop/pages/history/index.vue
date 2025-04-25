<script setup lang="ts">
import SearchOrder from './components/SearchOrder.vue'
import ExportOrder from './components/ExportOrder.vue'

import { useClipboard } from '@vueuse/core'

import type { HistoryStore } from './utils'
import { HISTORY_STORE, form, formatOrderParams } from './utils'
import { columns } from './utils/columns'
import { orderApi } from '@/api/orders'
import { toast } from 'vue-sonner'

const serviceStore = useServiceStore()
await serviceStore.getServices()

const page = ref(1)
const limit = ref(20)

const selectRows = ref<string[]>([])
const { copy } = useClipboard({ legacy: true })

const store: HistoryStore = reactive({
  orders: form.orders,
  searchForm: { ...form.search },
  exportForm: { ...form.export },
  visibleSearch: false,
  visibleExport: false
})

provide(HISTORY_STORE, store)

watch(
  [page, limit],
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

function handleCopy() {
  if (selectRows.value.length === 0) {
    toast.warning('请先选择要复制的行')
    return
  }

  copy(selectRows.value.join('\n'))
  toast.success('已复制到剪贴板')
}
</script>

<template>
  <div class="p-4 h-full">
    <section class="flex justify-between space-x-2 mb-3">
      <div class="space-x-2 whitespace-nowrap">
        <XButton label="搜索" @click="openSearch" />
        <XButton color="success" label="导出" @click="openExport" />
        <XButton color="warning" variant="outline" label="复制 IMEI/SN" @click="handleCopy" />
      </div>

      <XPagination
        v-model="page"
        v-model:limit="limit"
        :total="store.orders.total"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
          'sizes',
          'jumper',
        ]"
      />
    </section>

    <XTable
      :data="store.orders.list"
      :columns="columns"
      class="h-[calc(100%-3rem)]"
      row-key="id" selection
      selected-key="imei"
      @select-change="selectRows = $event"
    />

    <SearchOrder />
    <ExportOrder />
  </div>
</template>
