<script setup lang="ts">
import OrderSearch from './components/OrderSearch.vue'
import OrderDialog from './components/OrderDialog.vue'

import { downloadFile, ORDER_STATUS } from '@3un/utils'
import { useClipboard } from '@vueuse/core'
import { toast } from 'vue-sonner'

import type { Order, OrderListParams } from '@/inters/orders'
import { zOrderSearchForm, zOrderUpdateForm } from '@/inters/orders'
import { exportOrder, getOrders, pushOrder, reSubmitOrder, updateCodeStatus } from '@/api/orders'

import type { OrderStore } from './utils'
import { ORDER_STORE, columns } from './utils'

const store: OrderStore = reactive({
  orders: { list: [], total: 0, page: 1, pageSize: 20 },
  formSearch: zOrderSearchForm.parse({}),
  formUpdate: zOrderUpdateForm.parse({}),
  visibleSearch: false,
  visibleUpdate: false,
  index: undefined,
  refresh: false,
  page: 1,
  limit: 20,
})

provide(ORDER_STORE, store)

const route = useRoute()
const { copy } = useClipboard()

const loading = ref(false)
const selected = shallowRef<Order[]>([])

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  ([pageValue, limitValue]) => {
    getList({
      page: pageValue,
      pageSize: limitValue,
      ...store.formSearch,
    })
  }
)

watch(
  () => route.query.q,
  (value) => {
    store.formSearch = zOrderSearchForm.parse({})
    if (value === 'wait') {
      store.formSearch.statusId = ORDER_STATUS.WAIT
    }
    if (value === 'processing') {
      store.formSearch.statusId = ORDER_STATUS.PROCESSING
    }

    store.refresh = !store.refresh
    store.page = 1
  },
  { immediate: true }
)

function getList(params: OrderListParams) {
  loading.value = true

  const response = getOrders(params)
  response.then(data => store.orders = data)
  response.finally(() => loading.value = false)
}

function resetSearch() {
  store.formSearch = zOrderSearchForm.parse({})
  store.refresh = !store.refresh
  store.page = 1
}

function selectWrapper(fn: () => void) {
  return () => {
    if (selected.value.length === 0) {
      toast.warning('请先选择要复制的行')
      return
    }

    fn()
  }
}

const handleCopyImei = selectWrapper(() => {
  copy(
    selected.value
      .map(item => item.imeiNo)
      .filter(Boolean)
      .join('\n')
  )
  toast.success('复制成功')
})

const handleExport = selectWrapper(() => {
  const codeIds = selected.value.map(item => item.codeId)
  exportOrder(codeIds).then(data => downloadFile(data))
})

const handlePushOrder = selectWrapper(() => {
  const codeIds = selected.value.map(item => item.codeId)
  pushOrder(codeIds).then(() => {
    store.refresh = !store.refresh
    toast.success('推送成功')
  })
})

const handleAcceptOrder = selectWrapper(() => {
  const params = selected.value.map(item => ({
    userId: item.userId,
    codeId: item.codeId,
    codeStatusId: ORDER_STATUS.PROCESSING,
    originalStatus: item.codeStatusId,
  }))

  updateCodeStatus(params).then(() => {
    store.refresh = !store.refresh
    toast.success('接受成功')
  })
})

const handleReSubmitOrder = selectWrapper(() => {
  const codeIds = selected.value.map(item => item.codeId)
  reSubmitOrder(codeIds).then(() => {
    store.refresh = !store.refresh
    toast.success('重新提交成功')
  })
})

const handleRejectOrder = selectWrapper(() => {
  const params = selected.value.map(item => ({
    userId: item.userId,
    codeId: item.codeId,
    codeStatusId: ORDER_STATUS.FAILED,
    originalStatus: item.codeStatusId,
  }))

  updateCodeStatus(params).then(() => {
    store.refresh = !store.refresh
    toast.success('拒绝成功')
  })
})
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex space-x-2">
        <XButton
          icon="lucide:filter" label="筛选"
          @click="store.visibleSearch = true"
        />
        <XButton
          icon="lucide:brush-cleaning" label="清空筛选"
          color="warning" variant="outline"
          @click="resetSearch"
        />
      </div>

      <XPagination
        v-model="store.page"
        v-model:limit="store.limit"
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

    <section class="flex items-center p-3 pb-0">
      <XButton
        class="mr-2"
        size="sm"
        label="导出订单"
        icon="lucide:file-input"
        @click="handleExport"
      />
      <XButton
        size="sm"
        label="复制IMEI"
        icon="lucide:copy"
        @click="handleCopyImei"
      />

      <hr class="h-5 w-px mx-4 bg-border" />
      <div class="space-x-2">
        <XButton
          icon="lucide:bell" size="sm"
          color="warning" label="推送通知"
          @click="handlePushOrder"
        />
        <XButton
          icon="lucide:check" size="sm"
          color="success" label="接受订单"
          @click="handleAcceptOrder"
        />
        <XButton
          icon="lucide:refresh-cw" size="sm"
          color="primary" label="重新提交"
          @click="handleReSubmitOrder"
        />
        <XButton
          icon="lucide:x" size="sm"
          color="danger" label="拒绝订单"
          @click="handleRejectOrder"
        />
      </div>
    </section>

    <div class="p-3">
      <XTable
        :columns="columns"
        :data="store.orders.list"
        :loading="loading"

        selection row-key="codeId"
        class="border h-[calc(100vh-11.125rem)]"
        @select-change="selected = $event"
      />
    </div>

    <OrderSearch />
    <OrderDialog />
  </div>
</template>
