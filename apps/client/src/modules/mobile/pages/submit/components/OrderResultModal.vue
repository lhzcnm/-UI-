<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'

import { downloadURL } from '@3un/utils'
import { orderApi } from '@/api/orders'
import { SUBMIT_STORE } from '../utils'

const store = inject(SUBMIT_STORE)!
const exportLoading = ref(false)

const page = ref(1)
const pageSize = ref(10)

const orders = computed(() => {
  return store.rawOrders.slice(
    (page.value - 1) * pageSize.value,
    page.value * pageSize.value,
  )
})

const progress = computed<number>(() => {
  const unSuccess = store.rawOrders.length - store.count
  return (unSuccess / store.rawOrders.length) * 100 + 10
})

function handleExport() {
  const ids = store.rawOrders.map((item) => item.id)
  if (!store.serviceId || !ids?.length) {
    toast.warning('请选择服务')
    return
  }

  exportLoading.value = true
  const response = orderApi.submitExport({
    imeiList: store.rawOrders.map((item) => item.imei),
    serviceId: store.serviceId,
    orderIdList: ids,
  })

  response.then(({ data }) => downloadURL(data))
  response.finally(() => exportLoading.value = false)
}
</script>

<template>
  <TheModal v-model="store.visible" title="订单结果">
    <section class="relative px-4 pb-3 flex justify-between items-center">
      <XButton
        color="emerald"
        label="导出"
        :loading="exportLoading"
        @click="handleExport"
      />
      <XSimplePagination
        v-model="page"
        :page-size="pageSize"
        :total="store.rawOrders.length"
      />

      <div class="absolute bottom-0 left-0 w-full h-[1px] bg-border">
        <Transition name="fade-in">
          <div
            v-show="progress < 110"
            :class="twJoin(
              'size-full relative transition-transform duration-300',
              'bg-emerald-500 flow-light-effect overflow-hidden'
            )"
            :style="{ width: `${progress}%` }"
          >
            <div class="absolute top-0 bottom-0 left-0 right-0 light-beam"></div>
          </div>
        </Transition>
      </div>
    </section>

    <section class="px-4 h-[calc(90vh-7rem)] overflow-y-auto divide-y divide-dashed">
      <OrderCard
        v-for="(order, index) in orders" :key="order.id"
        class="w-full px-0 shadow-none rounded-none"
        :order="order" is-submit :index="index + 1"
      />
    </section>
  </TheModal>
</template>
