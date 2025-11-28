<script setup lang="ts">
import SearchModal from './components/SearchModal.vue'

import { toast } from 'vue-sonner'

import { getTickets, orderSearch, orderSubmit, refreshOrders } from '@/api/shop'
import { zSubmitParams, type Order, type OrderSearchForm, type RefreshParams, type SubmitParams } from '@/inters/order'
import { HISTORY_STORE, type HistoryStore } from './utils'
import { ORDER_STATUS } from '@3un/utils'

const store: HistoryStore = reactive({
  visibleSearch: false,
  visibleTicket: false,

  tickets: [],
  orderId: undefined,
})

provide(HISTORY_STORE, store)

const shopStore = useShopStore()
const { connect, close } = useWsStore()
const route = useRoute()
const { t } = useI18n()

const pendingOrders = ref<number[]>([])
const showAll = ref<boolean>(false)
const disabled = ref<boolean>(false)

const submitedKey = import.meta.env.VITE_SUBMIT_STORAGE
const paymentKey = import.meta.env.VITE_PAYMENT_STORAGE

let count = 0

watch(
  () => route.params.codeId,
  (value) => {
    shopStore.historySearch.codeIdList?.push(...value)
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

function handleSubmit() {
  const service = shopStore.servicesMap.get(+shopStore.createOrder.serviceId)!

  if(service.isUnlock) submitOrder()
  else submitQueryOrder()
}

function submitOrder() {
  orderSubmit(shopStore.createOrder).then((data) => {
    alert(JSON.stringify(data))
    const codeIds = data.map(item => item.codeId ? item.codeId.toString() : "0")
    shopStore.historySearch.codeIdList = codeIds
    shopStore.createOrder = zSubmitParams.parse({})

    localStorage.removeItem(paymentKey)
    localStorage.removeItem(submitedKey)
  })
}

function renderOrders(data: Order[]) {
  for(let item of data) {
    const index = shopStore.historys.list.findIndex(order => order.id === item.id)

    if(index === -1) {
      return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, item)
    }

    shopStore.historys.list[index] = {
      ...shopStore.historys.list[index],
      result: item.result,
      status: item.status,
    }
  }
}

function openFilter() {
  store.visibleSearch = true
}

async function refreshOrder() {
  pendingOrders.value = shopStore.historys.list
    .filter(item => item.status === ORDER_STATUS.PROCESSING)
    .map(item => item.id)
  
  if(pendingOrders.value.length === 0) return toast.success("订单全部处理完成")

  const params: RefreshParams = {
    serviceId: +shopStore.createOrder!.serviceId.toString,
    codeIdList: pendingOrders.value,
    showAll: showAll.value,
  }

  disabled.value = true

  try {
    const data = await refreshOrders(params)
    toast.success(t("submit.success", { action: t("button.query") }))
    renderOrders(data)
  } finally {
    setTimeout(() => {
      disabled.value = false
    }, 3000)
  }
}

function openTicket(id: number) {
  store.orderId = id
  store.visibleTicket = true
}

async function getTicketList() {
  const data = await getTickets()
  store.tickets = data
}

function submitQueryOrder() {
  const { data, status } = connect({
    serviceId: shopStore.createOrder!.serviceId,
    type: "order",
  })

  watch(
    (status),
    (value) => {
      if(value !== 'OPEN') {
        console.warn(`[3un] WebSocket ${t('action.submit.fail', { action: t('action.connect') })}`, value)
        return
      }

      submitOrder()
    },
    {
      once: true,
    }
  )

  watch(
    (data),
    (value) => {
      if(!value) return

      handleOrder(value)
      handleCount()
    }
  )
}

function handleOrder(jsonStr: string) {
  const data = JSON.parse(jsonStr) as Order

  let index = shopStore.historys.list.findIndex(item => item.id === data.id)

  if(index === -1) {
    return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, data)
  }

  shopStore.historys.list[index] = {
    ...shopStore.historys.list[index],
    result: data.result,
    status: data.status,
    id: data.id,
  }
}

function handleCount() {
  count--

  if(count === 0) {
    close()
  }
}

await getTicketList()

onMounted(() => {
  const submitedParams = localStorage.getItem(submitedKey)

  if(shopStore.createOrder.imeiList.length > 0) {
    handleSubmit()
  }

  if(submitedParams) {
    // console.log(submitedParams)
    shopStore.createOrder = JSON.parse(submitedParams) as SubmitParams

    handleSubmit()
  }
})

onUnmounted(() => {
  shopStore.historySearch = {
    serviceId: undefined,
    page: 1,
    pageSize: 20,
    codeIdList: [],
    imeiList: [],
  }
})
</script>

<template>
  <div class="space-y-6 h-full flex flex-col">
    <section class="flex justify-between p-3 border-b">
      <!-- <XButton
        :label="t('button.filter')"
        color="success" icon="lucide:circle-question-mark"
        @click="store.visibleSearch = true"
      /> -->
      <div class="flex space-x-2">
        <ButtonGroup
          :layouts="['filter']"
          @filter="openFilter"
        />
  
        <XButton
          :label="t('button.query')"
          color="success" icon="lucide:circle-question-mark"
          @click="refreshOrder"
        />
      </div>

      <XSimplePagination
        v-model="shopStore.historySearch.page"
        :limit="shopStore.historySearch.pageSize"
        :total="shopStore.historys.total"
      />
    </section>

    <section class="flex-1 overflow-y-auto p-2 flex flex-col space-y-6">
      <HistoryCard
        v-for="order in shopStore.historys.list" :key="order.id"
        :order="order"
        @ticket="openTicket"
      />
    </section>

    <SearchModal />
  </div>
</template>
