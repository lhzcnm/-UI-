<script setup lang="ts">
import ServiceConfirm from './components/ServiceConfirm.vue'
import ServiceDetail from './components/ServiceDetail.vue'
import ServicePrompt from './components/ServicePrompt.vue'
import ServiceForm from './components/ServiceForm.vue'
import TheBack from '@desktop/components/TheBack.vue'

// import { tv } from 'tailwind-variants'

import { checkQrcode, getServices, getTickets, orderPay, orderSubmit } from '@/api/shop'
import type { Service, ServiceParams } from '@/inters/services'
import { DETAIL_STORE, type DetailStore } from './utils'
import { zOrderForm, zSubmitParams, type OrderPayParams, type OrderView, type SubmitParams, type SubmitResp } from '@/inters/order'
import PayQrcode from './components/PayQrcode.vue'
import { ORDER_STATUS } from '@3un/utils'
import { toast } from 'vue-sonner'
import ServicePanel from './components/ServicePanel.vue'
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
      toast.success(t('store.prompt.submitUnlock'))
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

onBeforeUnmount(() => {
  handleClearInterval()
})

await getTicketList()

// const style = tv({
//   slots: {
//     root: [
//       'flex h-full w-full sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] xl:max-w-[60vw] gap-8 bg-canvas-light dark:bg-canvas-dark p-6 transition-colors duration-500',
//     ],
//     section: [
//       'rounded-2xl shadow-[0_0_40px_-20px_rgba(0,0,0,0.2)] border border-border p-6 transition-all duration-300',
//       'bg-layer-light dark:bg-layer-dark backdrop-blur-lg hover:shadow-[0_0_50px_-15px_rgba(0,0,0,0.25)]',
//       'flex flex-col space-y-4 bg-white dark:bg-black',
//     ],
//     order: [
//       'min-w-96 flex flex-col space-y-4',
//     ],
//   }
// })

// const b = style()
</script>

<template>
  <div v-if="shopStore.selService" class="w-full min-h-screen flex justify-center py-6 px-4">
    <div
      class="w-full max-w-6xl bg-white dark:bg-black rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 grid grid-cols-[1fr_350px] gap-6"
    >
      <section class="p-6 flex flex-col overflow-y-auto space-y-6">
        <div class="flex space-x-2">
          <TheBack />
          <XButton class="highlight-btn" label="查询结果" />
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
  </div>
</template>
