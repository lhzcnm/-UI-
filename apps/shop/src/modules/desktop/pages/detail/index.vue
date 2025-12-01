<script setup lang="ts">
import ServiceConfirm from './components/ServiceConfirm.vue'
import ServiceDetail from './components/ServiceDetail.vue'
import ServicePrompt from './components/ServicePrompt.vue'
import ServiceForm from './components/ServiceForm.vue'
import TheBack from '@desktop/components/TheBack.vue'
import ServicePanel from './components/ServicePanel.vue'
import RefundDialog from './components/RefundDialog.vue'
import PayQrcode from './components/PayQrcode.vue'

// import { tv } from 'tailwind-variants'

import { checkQrcode, getServices, getTickets, orderPay, orderSubmit, refreshOrders } from '@/api/shop'
import type { Service, ServiceParams } from '@/inters/services'
import { DETAIL_STORE, type DetailStore } from './utils'
import { zOrderForm, zSubmitParams, type Order, type OrderPayParams, type OrderView, type RefreshParams, type SubmitParams, type SubmitResp } from '@/inters/order'
import { ORDER_STATUS, xconfirm } from '@3un/utils'
import { toast } from 'vue-sonner'
import { useUserStore } from '@/stores/user'

const store: DetailStore = reactive({
  visibleConfirm: false,
  visibleQrcode: false,
  visibleTicket: false,

  orderForm: zOrderForm.parse({}),
  submitForm: zSubmitParams.parse({}),
  rawOrders: [],
  payType: 'wxpay',
  url: '',
  tickets: [],
  orderId: undefined,
})

provide(DETAIL_STORE, store)

const route = useRoute()
const shopStore = useShopStore()
const { t } = useI18n()
const { connect, close } = useWsStore()
const userStore = useUserStore()

const pendingOrders = ref<number[]>([])
const showAll = ref<boolean>(false)
const disabled = ref<boolean>(false)

let timer: ReturnType<typeof setInterval> | null = null
let count = 0

watch(
  () => route.params.id,
  async (id) => {
    await getService({ serverId: +id })
  },
  {
    immediate: true,
  },
)

async function getService(params: ServiceParams) {
  const data = await getServices(params)
  shopStore.selService = data[0].children[0]
}

function handleConfirm() {
  store.visibleConfirm = true
}

function handleTicket(id: number) {
  store.orderId = id
  store.visibleTicket = true
}

function handleSubmit() {
  const params: OrderPayParams = {
    id: "3",
    amount: store.submitForm.imeiList.length * +shopStore.selService!.storePrice,
    type: store.payType,
    openId: userStore.userInfo.openId ?? undefined,
  }

  orderPay(params).then((data) => {
    // store.url = data
    // store.visibleQrcode = true
    if(store.payType === 'wxpay') {
      store.url = data
      store.visibleQrcode = true
    } else {
      const a = document.createElement('a')
      a.href = data
      a.target = "_blank"
      a.click()
      a.remove()
    }

    validQrcode()
  })
}

function validQrcode() {
  timer = setInterval(() => {
    checkQrcode().then(({ data }) => {
      if(data) {
        store.visibleQrcode = false
        if(timer) {
          handleClearInterval()
        }
        store.orderForm = zOrderForm.parse({})
        handleOrderSubmit()
      }
    })
  }, 1300)
}

function handleClearInterval() {
  if(timer) {
    clearInterval(timer)
  }
}

function processWaitList(service: Service) {
  const buckets: OrderView[] = []
  const imeiList = store.submitForm.imeiList

  for(let i = 0; i < imeiList.length; i++) {
    buckets.push({
      id: 0,
      serviceId: service.id,
      status: ORDER_STATUS.WAIT,
      imei: imeiList[i],
      result: '',
      createTime: '',
    })
  }

  return buckets
}

function handleOrderSubmit() {
  const service: Service = shopStore.selService!

  const submitedOrders = processWaitList(service)
  store.rawOrders.splice(0, 0, ...submitedOrders)
  count = store.submitForm.imeiList.length

  if(service.isUnlock) submitOrder(service)
  else submitQueryOrder(service)
}

function submitQueryOrder(service: Service) {
  const { data, status } = connect({
    serviceId: service.id,
    type: 'order',
  })

  watch(
    (status),
    (value) => {
      if(value !== 'OPEN') {
        console.warn(`[3un] WebSocket ${t('action.submit.fail', { action: t('action.connect') })}`, value)
        return
      }
      submitOrder(service)
    },
    {
      once: true,
    },
  )

  watch(
    data,
    (value) => {
      if(!value) {
        return
      }

      handleOrder(value)
      handleCount()
    }
  )
}

function submitOrder(service: Service) {
  const params: SubmitParams = {
    ...store.submitForm
  }

  orderSubmit(params).then((data) => {
    if(service.isUnlock) {
      const res = data
        .map(item => `${item.imei}: ${item.status === ORDER_STATUS.FAILED ? t('message.order.failed') : t('message.order.success')}`)
        .join("<br>")

      xconfirm(res)
    }

    renderSubmitOrder(data)    
  }).catch((err) => {
    console.error(`[3un] ${t('submit.fail', { action: t('query.submit') })}`, err)
    close()
  })
}

function handleOrder(rawData: string) {
  const data = JSON.parse(rawData) as OrderView

  let index = store.submitForm.imeiList.indexOf(data.imei)

  if(index === -1) {
    return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, data)
  }

  store.rawOrders[index] = {
    ...store.rawOrders[index],
    result: data.result ? data.result : '',
    status: data.status,
    id: data.id,
  }
}

function renderSubmitOrder(data: SubmitResp[]) {
  // const result = []
  const imeiList = store.submitForm.imeiList

  for(let item of data) {
    const index = imeiList.indexOf(item.imei)

    if(index === -1) {
      return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, item)
    }

    const isFailed = item.status === ORDER_STATUS.FAILED

    if(isFailed) {
      handleCount()
    }
    
    // result.push({
    //   ...store.rawOrders[index],
    //   ...(isFailed && { result: item.message ?? "" }),
    //   status: item.status,
    // })

    store.rawOrders[index] = {
      ...store.rawOrders[index],
      ...(isFailed && { result: item.message ?? "" }),
      status: item.status,
      id: item.codeId ? item.codeId : 0,
    }
  }

  // store.rawOrders = result
}

function handleCount() {
  count -= 1
  if(count === 0) {
    close()
  }
}

async function getTicketList() {
  const data = await getTickets()
  store.tickets = data
}

async function refreshOrder() {
  pendingOrders.value = store.rawOrders
    .filter(item => item.status === ORDER_STATUS.PROCESSING)
    .map(item => item.id)
    .filter(item => item !== 0)
  
  if(pendingOrders.value.length === 0) return toast.success(t('shop.prompt.refreshNull'))

  const params: RefreshParams = {
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

function renderOrders(data: Order[]) {
  for(let item of data) {
    const index = store.rawOrders.findIndex(order => order.id === item.id)

    if(index === -1) {
      return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, item)
    }

    // shopStore.historys.list[index] = {
    //   ...shopStore.historys.list[index],
    //   result: item.result,
    //   status: item.status,
    // }

    store.rawOrders[index] = {
      ...store.rawOrders[index],
      result: item.result,
      status: item.status,
    }
  }
}

onBeforeUnmount(() => {
  handleClearInterval()
})

await getTicketList()
</script>

<template>
  <div v-if="shopStore.selService" class="w-full min-h-screen flex justify-center py-6 px-4">
    <div
      class="w-full max-w-6xl bg-white dark:bg-black rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 grid grid-cols-[1fr_350px] gap-6"
    >
      <section class="p-6 flex flex-col overflow-y-auto space-y-6">
        <div class="flex space-x-2">
          <TheBack />
          <XButton v-if="shopStore.selService.isUnlock" :disabled class="highlight-btn w-20 items-center px-2 rounded-md" :label="t('button.query')" @click="refreshOrder" />
        </div>

        <ServiceDetail :service="shopStore.selService" />

        <ServiceForm
          :service="shopStore.selService"
          v-model="store.orderForm"
          @confirm="handleConfirm"
        />

        <ServicePrompt />
      </section>

      <ServicePanel
        :orders="store.rawOrders"
        @ticket="handleTicket"
      />
    </div>

    <ServiceConfirm @submit="handleSubmit" />
    <PayQrcode />
    <RefundDialog />
  </div>
</template>
