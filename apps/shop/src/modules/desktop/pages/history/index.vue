<script setup lang="ts">
import TheBack from '@desktop/components/TheBack.vue'

import { HISTORY_STORE, type HistoryStore } from './utils'
import type { OrderSearchForm } from '@/inters/order'
import { getServices, getTickets, orderSearch } from '@/api/shop'
import { XPagination } from '@3un/ui'
import RefundDialog from './components/RefundDialog.vue'
import { debounce } from '@3un/utils'

const store: HistoryStore = reactive({
  visibleRefund: false,
  visibleTicket: false,

  tickets: [],
  services: [],

  orderId: undefined,
})

provide(HISTORY_STORE, store)


const shopStore = useShopStore()
const { t } = useI18n()
const route = useRoute()

const imei = ref<string>("")
const codeId = ref<string>("")

watch(
  () => route.params.codeId,
  (value) => {
    shopStore.historySearch.codeIdList?.push(...value)
  }
)

watch(
  () => route.query.codeId,
  (value) => {
    if(typeof value === "string") {
      shopStore.historySearch.codeIdList?.push(value)
    }
  }
)

watch(
  () => shopStore.historySearch,
  async (params) => {
    await getOrderList(params)
  },
  {
    immediate: true,
    deep: true,
  }
)

async function getOrderList(params: OrderSearchForm) {
  const data = await orderSearch(params)
  shopStore.historys = data
}

async function getServiceList() {
  const data = await getServices()
  store.services = data
}

async function getTicketList() {
  const data = await getTickets()
  store.tickets = data
}

function openTicket(id: number) {

  store.orderId = id
  store.visibleTicket = true
}

const handleImei = debounce(() => {
  shopStore.historySearch.imeiList = [imei.value]
})

const handleCodeId = debounce(() => {
  shopStore.historySearch.codeIdList = [codeId.value]
})

await Promise.all([
  getServiceList(),
  getTicketList(),
])
</script>

<template>
  <div class="min-h-full w-full flex flex-col p-4 sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] mx-auto mb-2">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">{{ t('order.history.title') }}</h2>
      <TheBack />
    </div>

    <div class="flex justify-between mb-4">
      <div class="flex space-x-2">
        <SelectServices class="min-w-64" :services="store.services" v-model="shopStore.historySearch.serviceId" />
        <XInput ui-root="min-w-64" :placeholder="t('order.history.placeholder.imei')" v-model="imei" @input="handleImei" />
        <XInput ui-root="min-w-64" :placeholder="t('order.history.placeholder.codeId')" v-model="codeId" @input="handleCodeId" />
      </div>

      <XPagination
        v-model="shopStore.historySearch.page"
        v-model:limit="shopStore.historySearch.pageSize"
        :total="shopStore.historys.total"
        :layouts="[
          'total',
          'prev',
          'pager',
          'next',
        ]"
      />
    </div>

    <div
      v-if="shopStore.historys.list.length === 0"
      class="text-gray-500 text-sm mt-10 text-center">
      {{ t('order.history.none') }}
    </div>

    <section v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <HistoryCard
        v-for="order in shopStore.historys.list"
        :key="order.id"
        :order="order"
        @ticket="openTicket"
      />
    </section>

    <RefundDialog />
  </div>
</template>
