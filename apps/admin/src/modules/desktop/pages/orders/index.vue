<script setup lang="ts">
import OrderSearch from './components/OrderSearch.vue'
import OrderDialog from './components/OrderDialog.vue'

import type { Order, OrderListParams } from '@/inters/orders'
import { zOrderSearchForm, zOrderUpdateForm } from '@/inters/orders'
import { getOrders } from '@/api/orders'

import { ORDER_STATUS } from '@3un/utils'

import type { OrderStore } from './utils'
import { ORDER_STORE } from './utils'
import { columns } from './utils/column'

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

const loading = ref(false)
const selected = shallowRef<Order[]>([])

const route = useRoute()

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
    store.refresh = !store.refresh
    store.page = 1

    if (value === 'verify') {
      // store.formSearch.verify = ORDER_VERTIFY.NORMAL
    }
    if (value === 'wait') {
      store.formSearch.statusId = ORDER_STATUS.WAIT
    }
    if (value === 'processing') {
      store.formSearch.statusId = ORDER_STATUS.PROCESSING
    }
  },
  { immediate: true }
)

function getList(params: OrderListParams) {
  loading.value = true

  const response = getOrders(params)
  response.then(data => store.orders = data)
  response.finally(() => loading.value = false)
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex space-x-2">
        <XButton
          icon="lucide:filter" label="筛选"
          @click="store.visibleSearch = true"
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

    <div class="p-3">
      <XTable
        :columns="columns"
        :data="store.orders.list"
        :loading="loading"

        selection row-key="codeId"
        class="border h-[calc(100vh-8.75rem)]"
        @select-change="selected = $event"
      />
    </div>

    <OrderSearch />
    <OrderDialog />
  </div>
</template>
