<script setup lang="ts">
import OrderSearch from './components/OrderSearch.vue'
import OrderModal from './components/OrderModal.vue'
import OrderClean from './components/OrderClean.vue'
import OrderCard from './components/OrderCard.vue'

import { ORDER_STATUS } from '@3un/utils'
import { hash } from 'ohash'

import type { OrderListParams } from '@/inters/orders'
import { zOrderSearchForm, zOrderUpdateForm } from '@/inters/orders'
import { getOrders } from '@/api/orders'
import { createList } from '@/utils'

import type { OrderStore } from './utils'
import { ORDER_STORE } from './utils'

const store: OrderStore = reactive({
  orders: createList(),

  formSearch: zOrderSearchForm.parse({}),
  formUpdate: zOrderUpdateForm.parse({}),
  formClean: { checked: '7', time: '' },

  visibleSearch: false,
  visibleUpdate: false,
  visibleClear: false,

  refresh: false,
  index  : undefined,
  page   : 1,
  limit  : 20,
})

provide(ORDER_STORE, store)

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const queryHash = computed(() => hash(route.query)) 

watch(
  [
    () => store.page,
    () => store.limit,
    () => store.refresh,
  ],
  ([pageValue, limitValue]) => {
    const imeiList = store.formSearch.imeiList

    getList({
      page: pageValue,
      pageSize: limitValue,
      ...store.formSearch,
      imeiList: imeiList
        ? imeiList
            .trim()
            .split(/[\s,]+/)
            .filter(Boolean)
        : undefined,
    })
  }
)

watch(
  () => route.query,
  ({ imei, uid, q }) => {
    const statusMap = {
      wait: ORDER_STATUS.WAIT,
      processing: ORDER_STATUS.PROCESSING,
    }

    type StatusKey = keyof typeof statusMap

    store.formSearch = {
      ...zOrderSearchForm.parse({}),
      userId: uid ? Number(uid) : undefined,
      imeiList: imei ? imei as string: undefined,
      statusId: q ? statusMap[q as StatusKey] : undefined,
    }

    store.refresh = !store.refresh
    store.page = 1
  },
  { immediate: true }
)

function getList(params: OrderListParams) {
  loading.value = true

  const response = getOrders(params)
  response.then(data => {
    store.orders = data
  })

  response.finally(() => loading.value = false)
}

function resetSearch() {
  router.replace({
    force: true,
    path: route.path,
    query: { q: route.query.q },
  })
}

function handleCleanOrder() {
  store.formClean = { checked: '7', time: '' }
  store.visibleClear = true
}
</script>

<template>
  <div>
    <Toolbar :loading="loading">
      <XSimplePagination
        v-model="store.page"
        :limit="store.limit"
        :total="store.orders.total"
      />

      <template #extra>
        <div class="flex items-center">
          <XButton
            label="筛选"
            class="mr-2"
            icon="lucide:filter"
            @click="store.visibleSearch = true"
          />
          <XButton
            label="清空筛选"
            variant="outline"
            icon="lucide:brush-cleaning"
            @click="resetSearch"
          />

          <hr class="h-6 w-px mx-4 bg-border" />

          <XButton
            label="清理订单"
            color="danger"
            variant="outline"
            icon="lucide:trash-2"
            @click="handleCleanOrder"
          />
      </div>
      </template>
    </Toolbar>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <NoMessage
        v-if="!loading && store.orders.list.length === 0"
        class="h-auto bg-card border rounded-lg p-3"
      />

      <template v-else>
        <OrderCard
          v-for="(order, index) in store.orders.list"
          :key="order.codeId" :order="order" :index="index"
        />
      </template>
    </section>

    <OrderSearch :key="queryHash" />
    <OrderModal />
    <OrderClean />
  </div>
</template>
