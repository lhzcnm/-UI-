<script setup lang="ts">
import PayQrcode from './PayQrcode.vue'
import PayMethod from './PayMethod.vue'

import type { OrderPayParams } from '@/inters/order'
import { SERVICE_STORE } from '../utils'
import type { DetailStepEmits, PayType } from '../utils/types'
import { orderPay } from '@/api/shop'
import { toast } from 'vue-sonner'
// import { ua } from '@3un/utils'
// import PayQrcode from '../../components/PayQrcode.vue'

// import { toast } from 'vue-sonner'

// import type { StorePayParams } from '@/api/store/types'
// import { storePay } from '@/api/store'

const store = inject(SERVICE_STORE)!
const shopStore = useShopStore()

const payType = ref<PayType>('wxpay')

const emits = defineEmits<DetailStepEmits>()

const service = shopStore.selService!

const validImeis = computed(() => {
  let res = ''

  if(store.createOrder.imeiList.length >= 0) {
    res = store.createOrder.imeiList.join('\n')
  }

  return res
})

const amount = computed(() => {
  return +service.storePrice * store.createOrder.imeiList.length
})

function handleConfirm() {
  handlePay()
}

function isJSON(str: string) {
  try {
    const obj = JSON.parse(str)
    return typeof obj === 'object' && obj !== null
  } catch {
    return false
  }
}

function handlePay() {
  const params: OrderPayParams = {
    id: '3',
    amount: amount.value,
    type: payType.value,
  }
  
  orderPay(params).then((data) => {
    console.log(data)
    // location.href = data
    if(payType.value === 'wxpay') {
      if(isJSON(data)) {
        const config = JSON.parse(data)
        handleWecharPay(config)
      } else {
        store.url = data
        store.visiblePay = true
      }
    } else if(payType.value === 'alipay') {
      const a = document.createElement('a')
      a.href = data
      a.target = '_blank'
      a.click()
      a.remove()
    }
  }).catch((err) => {
    console.error(err)
    toast.error('生成支付二维码失败')
  }).finally(() => {
    store.visiblePay = true
  })
}

function onBridgeReady(config: WXInvokeConfig) {
  config = { ...config, package: config.packageValue! }

  window.WeixinJSBridge?.invoke(
    'getBrandWCPayRequest', config,
    (res) => {
      if(res.err_msg == 'get_brand_wcpay_request:ok') {
        window.WeixinJSBridge?.call('closeWindow')
      }
    }
  )
}

function handleWecharPay(config: WXInvokeConfig) {
  if(typeof window.WeixinJSBridge === 'undefined') {
    if(document.addEventListener) {
      document.addEventListener(
        'WeixinJSBridgeReady',
        () => onBridgeReady(config),
        false,
      )
    }
    return
  }
  onBridgeReady(config)
}
</script>

<template>
  <div
    class="flex flex-col space-y-6 p-6 rounded-2xl border border-border bg-white dark:bg-zinc-900 shadow-sm dark:shadow-zinc-800 transition-all duration-300"
  >
    <div class="flex flex-col space-y-2">
      <span class="text-base font-medium text-zinc-800 dark:text-zinc-200">
        有效 IMEI 数量: 
        <span class="font-semibold text-primary">{{ store.createOrder.imeiList.length }}</span>
      </span>
      <div
        class="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-sm font-mono text-zinc-700 dark:text-zinc-300 whitespace-pre-line"
      >
        {{ validImeis }}
      </div>
    </div>

    <PayMethod v-model="payType" />

    <div class="flex flex-col border-t border-border pt-4 space-y-2">
      <div class="flex justify-between items-center text-lg text-zinc-700 dark:text-zinc-300">
        <span>单次服务价格</span>
        <span class="font-semibold text-primary">￥{{ service.storePrice }}</span>
      </div>
      <div class="flex justify-between items-center text-lg text-zinc-800 dark:text-white">
        <span>总价格</span>
        <span class="text-2xl font-bold text-primary">￥{{ amount }}</span>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <XButton
        :disabled="store.submited"
        variant="outline"
        label="上一步"
        class="px-6"
        @click.prevent="emits('prev', 'order')"
      />
      <XButton
        :disabled="store.submited"
        label="确认"
        class="px-6"
        @click.prevent="handleConfirm"
      />
    </div>

    <PayQrcode :payType="payType" />
  </div>
</template>
