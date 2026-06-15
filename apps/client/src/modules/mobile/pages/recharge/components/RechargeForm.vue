<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { toast } from 'vue-sonner'
import { twMerge } from 'tailwind-merge'

import type { RechargeMethod } from '@/api/recharge'
import { rechargeApi } from '@/api/recharge'

const iStore = useSettingStore()
const uStore = useUserStore()

const customAmount = ref(0)
const selectedAmount = ref(0)
const selectedPayment = ref<RechargeMethod>('wxpay')

// const amountList = ref<{ label: string; value: number; info?: string }[]>([])
const { locale } = useI18n()
const localStore = useLocalStore()

const isWechat = computed(() => selectedPayment.value === 'wxpay')


const payFee = computed(() => {
  const res = { fee: iStore.handleFee.fee, threshold: iStore.handleFee.threshold }

  if (isWechat.value) {
    res.fee = iStore.handleFee.wxFee
    res.threshold = iStore.handleFee.wxThreshold
  }

  return res
})

const serviceFee = computed(() => {
  const amount = selectedAmount.value || customAmount.value
  return amount < +payFee.value!.threshold ? Number((amount * +payFee.value!.fee).toFixed(2)) : 0
})

const rechargeAmount = computed(() => {
  return selectedAmount.value || customAmount.value
})

const amountList = [
  { label: '￥10', value: 10 },
  { label: '￥50', value: 50 },
  { label: '￥100', value: 100 },
  { label: '￥200', value: 200 },
  { label: '￥500', value: 500 },
  { label: '￥1000', value: 1000 },
]

const rechargeInfo = computed(() => {
  return locale.value === 'zh'
    ? iStore.settings.paymentInfo
    : iStore.settings.paymentInfoEn
      ? iStore.settings.paymentInfoEn
      : iStore.settings.paymentInfo
})

function handleCustomAmount(value: any) {
  if (!value) return

  const numStr = value.toString().replace(/[^\d]/g, '')
  const numValue = numStr ? parseInt(numStr) : 0

  customAmount.value = numValue
  selectedAmount.value = 0
}

function handleRecharge() {
  if (!rechargeAmount.value) return toast.warning(localStore.localData['recharge_AmountZero_Toast'])

  const minAccount = +iStore.settings.minRechargeAmount
  const maxAccount = +iStore.settings.maxRechargeAmount

  if (rechargeAmount.value < minAccount) {
    return toast.warning(localStore.localeSlotVal('recharge_MinRecharge', { '{minAmount}': minAccount }))
  }

  if (rechargeAmount.value > maxAccount) {
    return toast.warning(localStore.localeSlotVal('recharge_MaxRecharge', { '{maxAmount}': maxAccount }))
  }

  const response = rechargeApi.create({
    openId: uStore.info.openId,
    type: selectedPayment.value,
    amount: rechargeAmount.value,
    id: 1,
  })

  response.then(({ data }) => {
    if (selectedPayment.value === 'wxpay') {
      const config = JSON.parse(data)
      handleMobileWechatPay(config)
    }
    if (selectedPayment.value === 'alipay') {
      window.location.href = `/alipay?goto=${data}`
    }
  })
}

function handleMobileWechatPay(config: WXInvokeConfig) {
  if (typeof window.WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener(
        'WeixinJSBridgeReady',
        () => onBridgeReady(config),
        false
      )
    }
    return
  }
  onBridgeReady(config)
}

function onBridgeReady(config: WXInvokeConfig) {
  config = { ...config, package: config.packageValue! }

  window.WeixinJSBridge?.invoke(
    'getBrandWCPayRequest', config,
    (res) => {
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        window.WeixinJSBridge?.call('closeWindow')
      }
    }
  )
}
</script>

<template>
  <div class="bg-card border p-4 rounded-md space-y-4">

    <div class="space-y-3">
      <h3 class="text-lg font-medium">{{ localStore.localData['recharge_RechargeAmount'] }}</h3>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-2">
        <button v-for="item in amountList" :key="item.value" :class="twMerge(
          'flex flex-col items-center justify-center space-y-1',
          'h-16 rounded-md bg-card border',
          customAmount === item.value && 'ring-2 ring-primary bg-primary/10',
        )" @click="selectedAmount = item.value; customAmount = item.value">
          <span>{{ item.label }}</span>
          <span v-if="item.value >= +(payFee!.threshold)" class="text-sm text-success">{{
            localStore.localData['recharge_CostFree'] }}</span>
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <PriceInput v-model="customAmount" :placeholder="localStore.localData['recharge_CustomAmount']"
          @update:model-value="handleCustomAmount" />
      </div>
    </div>

    <div class="space-y-3">
      <h3 class="text-lg font-medium">{{ localStore.localData['recharge_PaymentMethod'] }}</h3>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(108px,_1fr))] gap-2">
        <button :class="twMerge(
          'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
          selectedPayment === 'wxpay' && 'ring-2 ring-primary bg-primary/10',
        )" @click="selectedPayment = 'wxpay'">
          <Icon icon="ri:wechat-pay-fill" class="size-6 text-success" />
          <span>{{ localStore.localData['recharge_WeChatPay'] }}</span>
        </button>
        <button :class="twMerge(
          'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
          selectedPayment === 'alipay' && 'ring-2 ring-primary bg-primary/10',
        )" @click="selectedPayment = 'alipay'">
          <Icon icon="ri:alipay-fill" class="size-6 text-primary" />
          <span>{{ localStore.localData['recharge_Alipay'] }}</span>
        </button>
      </div>
    </div>

    <div v-if="iStore.settings.enablePaymentInfo" class="bg-muted p-3 rounded-md">
      <p class="mb-2 font-medium">{{ localStore.localData['recharge_RechargeInfo'] }}: </p>
      <div class="tiptap text-sm text-muted-foreground" v-html="rechargeInfo" />
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <span>{{ localStore.localData['recharge_RechargeAmount'] }}</span>
        <span>￥{{ rechargeAmount }}</span>
      </div>

      <div v-if="serviceFee > 0" class="flex items-center justify-between text-sm text-muted-foreground">
        <span>{{ localStore.localData['recharge_HandlingFee'] }}({{ (+payFee!.fee * 100).toFixed(2) }}%)</span>
        <span>￥{{ serviceFee }}</span>
      </div>

      <div class="flex items-center justify-between pt-2 border-t">
        <span>{{ localStore.localData['recharge_PayableAmount'] }}</span>
        <span class="text-lg font-medium text-danger">
          ￥{{ (rechargeAmount + serviceFee).toFixed(2) }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <XButton :label="localStore.localData['recharge_RechargeNow']" @click="handleRecharge" />
    </div>
  </div>
</template>
