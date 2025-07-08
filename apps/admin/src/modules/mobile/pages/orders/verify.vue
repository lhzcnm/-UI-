<script setup lang="ts">
import OrderVerifyCard from './components/OrderVerifyCard.vue'

import { ORDER_VERIFY } from '@3un/utils'

import type { OrderListParams } from '@/inters/orders'
import { zOrderSearchForm } from '@/inters/orders'
import { getOrders } from '@/api/orders'
import { createList } from '@/utils'

import type { VerifyStore } from './utils'
import { VERIFY_STORE } from './utils'

const store: VerifyStore = reactive({
  orders: createList(),

  refresh: false,
  page   : 1,
  limit  : 20,
})

provide(VERIFY_STORE, store)

const loading = ref(false)

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
      ...zOrderSearchForm.parse({}),
      verify: ORDER_VERIFY.REPLIED,
      imeiList: undefined,
    })
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
    <section class="relative flex items-center justify-between px-3 py-2 bg-card border-b">
      <span class="text-sm text-muted-foreground">{{ store.orders.total }} 条待验证订单</span>
      <XSimplePagination
        v-model="store.page"
        :limit="store.limit"
        :total="store.orders.total"
      />
      <div v-show="loading" class="absolute left-0 right-0 -bottom-0.5 h-0.5 overflow-hidden bg-primary/10">
        <div class="h-full w-1/3 x-animation-slide rounded bg-primary" />
      </div>
    </section>

    <section class="overflow-y-auto h-[calc(100vh-6.85rem)] space-y-2 p-3">
      <NoMessage
        v-if="!loading && store.orders.list.length === 0"
        class="h-auto bg-card border rounded-lg p-3"
      />

      <template v-else>
        <OrderVerifyCard
          v-for="(order, index) in store.orders.list"
          :key="order.codeId" :order="order" :index="index"
        />
      </template>
    </section>
  </div>
</template>
