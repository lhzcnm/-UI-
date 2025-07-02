<script setup lang="ts">
import { ORDER_VERIFY } from '@3un/utils'
import { toast } from 'vue-sonner'

import type { Order, OrderListParams } from '@/inters/orders'
import { getOrders, updateOrderVerify } from '@/api/orders'
import { zOrderSearchForm } from '@/inters/orders'
import { createList } from '@/utils'

import type { VerifyStore } from './utils'
import { columns } from './utils/columnVerify'
import { VERIFY_STORE } from './utils'

const store: VerifyStore = reactive({
  orders: createList(),

  refresh: false,
  page   : 1,
  limit  : 20,
})

provide(VERIFY_STORE, store)

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

function handleReply(verify: number) {
  if (selected.value.length === 0) {
    toast.warning('请先选择要操作的行')
    return
  }

  const verifyList = selected.value.map(item => ({
    code: item.code.trim().split('\n').join('<br>'),
    originalStatus: item.codeStatusId,
    codeId: item.codeId,
    userId: item.userId,
    codeStatusId: verify,
    verify,
  }))

  const response = updateOrderVerify(verifyList)
  response.then(() => {
    store.refresh = !store.refresh
    store.page = 1
  })
}
</script>

<template>
  <div>
    <section class="flex justify-between p-3 border-b">
      <div class="flex space-x-2">
        <XButton
          label="批量回复"
          icon="lucide:message-circle-reply"
          @click="handleReply(ORDER_VERIFY.SOLVED)"
        />
        <XButton
          label="批量退积分"
          color="danger" icon="lucide:x"
          @click="handleReply(ORDER_VERIFY.REFUNDED)"
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

    <div class="p-3 pb-0">
      <XTable
        :columns="columns"
        :loading="loading"
        :data="store.orders.list"
        selection row-key="codeId"
        class="border h-[calc(100vh-8.75rem)]"
        @select-change="selected = $event"
      />
    </div>
  </div>
</template>
