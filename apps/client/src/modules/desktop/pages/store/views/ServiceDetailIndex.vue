<script setup lang="ts">
import BaseForm from '../components/service/BaseForm.vue'
import ServiceDetail from '../components/service/ServiceDetail.vue'
import QrcodeDialog from '../components/service/QrcodeDialog.vue'
import ConfirmDialog from '../components/service/ConfirmDialog.vue'
import StoreOrderCard from '@/components/card/StoreOrderCard.vue'
import SubmitPrompt from '../components/service/SubmitPrompt.vue'

import { toast } from 'vue-sonner'
import { EMAIL_REG, ORDER_STATUS, ORDER_VERIFY, PHONE_REG } from '@3un/utils'
import { tv } from 'tailwind-variants'

import type { FormType, StoreOrder, StoreOrderView } from '../utils/types'
import { SERVICE_STORE } from '../utils/symbol'
import { getSubmitImei, validate, type ValidRule } from '@/utils'
import type { OrderSubmitResp, ServiceItem, StorePayParams, SubmitParams } from '@/api/store/types'
import { checkQrcode, storePay, storeSubmit } from '@/api/store'

const store = inject(SERVICE_STORE)!

const form = reactive<FormType>({
  serviceId: store.selectService.id,
  price: 0,
  imei: '',
  pushRes: true,
  phone: '',
  mail: '',
})

const { storeConnect, close } = useWsStore()

const { t } = useI18n()


let count = 0
let timer: ReturnType<typeof setInterval> | null = null

watch(
  () => form.pushRes,
  (val) => {
    if(!val) {
      if(store.selectService.isUnlock) {
        return toast.warning(t('store.prompt.unlock'))
      }
    }
  }
)

function handleCancel() {
  store.visibleTool = false
  store.storeStatus = "serviceStore"
  store.rawOrder.length = 0
}

function handleConfirm() {
  const rules: ValidRule[] = []
  const service = store.selectService

  if(service.isUnlock) {
    if(!form.pushRes) {
      return toast.warning(t('store.prompt.unlock'))
    }
  }

  if(form.pushRes) {
    if(!form.phone && !form.mail) {
      return toast.warning(t('store.prompt.pushSource'))
    }
  }

  if(form.phone) {
    rules.push({
      rule: PHONE_REG.test(form.phone),
      message: t('store.valid.profile.phone_format'),
    })
  }

  if(form.mail) {
    rules.push({
      rule: EMAIL_REG.test(form.mail),
      message: t('store.valid.profile.email_format'),
    })
  }

  rules.push({
    rule: !!form.imei,
    message: t('store.valid.store.imeiNull')
  })

  if(!validate(rules)) return

  store.imeiList.length = 0
  formatImei()

  store.visibleConfirm = true
}

function formatImei() {
  let allImeis: string[] = []
  const imeis = form.imei.split('\n')

  for(const item of imeis) {
    const imeiArr = item.split(',')

    for(const imei of imeiArr) {
      allImeis.push(imei)
    }
  }

  allImeis = [...new Set(allImeis)]

  const imeiType = store.selectService.imeiType
  store.imeiList = getSubmitImei(allImeis.join('\n'), imeiType)
}

function handleSubmit() {
  const params: StorePayParams = {
    id: '3',
    amount: store.imeiList.length * +store.selectService.storePrice,
    type: store.payType
  }

  storePay(params).then(({ data }) => {
    if(store.payType === 'wxpay') {
      store.url = data
      store.visibleQrcode = true
    } else if(store.payType === 'alipay') {
      const a = document.createElement('a')

      a.href = data
      a.target = '_blank'
      a.click()
      a.remove()
    }

    validQrcode()
  }).catch(() => {
    return toast.warning(t('store.prompt.qrcodeError'))
  })
}

function validQrcode() {
  timer = setInterval(() => {
    checkQrcode().then(({ data }) => {
      if(data) {
        store.visibleQrcode = false
        if(timer) {
          clearInterval(timer)
        }
        store.rawOrder.length = 0
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

function handleOrderSubmit() {
  const service: ServiceItem = store.selectService

  store.rawOrder = processWaitList(service)

  count = store.imeiList.length
  form.imei = ''

  if(service.isUnlock) submitOrder(service)
  else submitQueryOrder(service)
}

function processWaitList(service: ServiceItem) {
  const buckets: StoreOrderView[] = []
  const imeiList = store.imeiList

  for(let i = 0; i < imeiList.length; i++) {
    buckets.push({
      id: 0,
      index: i + 1,
      serviceId: service.id,
      serviceName: service.title,
      credits: service.price,
      status: ORDER_STATUS.WAIT,
      verify: ORDER_VERIFY.NORMAL,
      imei: imeiList[i],
      result: '',
      createTime: '',
    })
  }

  return buckets
}

function submitQueryOrder(service: ServiceItem) {
  const { data, status } = storeConnect({
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

function submitOrder(service: ServiceItem) {
  const params: SubmitParams = {
    groupId: service.parentId,
    serviceId: service.id.toString(),
    imeiList: store.imeiList,
    isBulk: true,
    isPushNotification: form.pushRes,
    phoneNumber: form.phone,
    email: form.mail,
  }

  storeSubmit(params).then(({ data }) => {
    if(service.isUnlock) {
      return toast.success(t('store.prompt.submitUnlock'))
    }

    renderSubmitOrder(data)    
  }).catch((err) => {
    console.error(`[3un] ${t('submit.fail', { action: t('query.submit') })}`, err)
    close()
  })
}

function handleOrder(rawData: string) {
  const data = JSON.parse(rawData) as StoreOrder

  let index = store.imeiList.indexOf(data.imei)

  if(index === -1) {
    return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, data)
  }

  store.rawOrder[index] = {
    ...store.rawOrder[index],
    result: data.result ? data.result : '',
    status: data.status,
    id: data.id,
  }
}

function renderSubmitOrder(data: OrderSubmitResp[]) {
  const result = []
  const imeiList = store.imeiList

  for(let item of data) {
    const index = imeiList.indexOf(item.imei)

    if(index === -1) {
      return console.error(`[3un] ${t('query.prompt.imeiNotExist')}`, item)
    }

    const isFailed = item.status === ORDER_STATUS.FAILED

    if(isFailed) {
      handleCount()
    }
    
    result.push({
      ...store.rawOrder[index],
      ...(isFailed && { result: item.message }),
      status: item.status,
    })
  }

  store.rawOrder = result
}

function handleCount() {
  count -= 1
  if(count === 0) {
    close()
  }
}

const style = tv({
  slots: {
    root: [
      'w-full flex h-full gap-8 bg-canvas-light dark:bg-canvas-dark p-6 transition-colors duration-500',
    ],
    section: [
      'rounded-2xl shadow-[0_0_40px_-20px_rgba(0,0,0,0.2)] border border-border p-6 transition-all duration-300',
      'bg-layer-light dark:bg-layer-dark backdrop-blur-lg hover:shadow-[0_0_50px_-15px_rgba(0,0,0,0.25)]',
      'flex flex-col space-y-4 bg-white dark:bg-black',
    ],
    order: [
      'min-w-96 flex flex-col space-y-4',
    ],
  }
})

const b = style()

onMounted(() => {
  history.pushState(null, '', location.href)
  window.addEventListener('popstate', () => {
    store.rawOrder.length = 0
    store.visibleTool = false
    store.storeStatus = "serviceStore"
  })
})

onBeforeUnmount(() => {
  handleClearInterval()
  close()
})
</script>

<template>
  <div :class="b.root()">
    <section :class="[b.section(), 'flex-1']">
      <ServiceDetail :service="store.selectService" />
      <BaseForm v-model="form" :service="store.selectService" @confirm="handleConfirm" @cancel="handleCancel" />
      <SubmitPrompt />
    </section>
    <section :class="[b.section(), b.order()]">
      <div class="flex items-center text-sm text-zinc-300 dark:text-zinc-600 gap-2">
        <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
        <span>{{ t('store.result') }}</span>
        <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
      </div>
      <div class="p-4 flex-1 overflow-y-auto flex flex-col space-y-4" style="scrollbar-width: none;">
        <template
          v-if="store.rawOrder.length !== 0"
          v-for="(order, index) in store.rawOrder" :key="`${order.id}`">
          <StoreOrderCard
            :order :index
          />
        </template>
      </div>
    </section>

    <ConfirmDialog @submit="handleSubmit" />
    <QrcodeDialog />
  </div>
</template>
