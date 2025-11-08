<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { toast } from 'vue-sonner'
import { twMerge } from 'tailwind-merge'

import type { RechargeMethod } from '@/api/recharge'
import { rechargeApi } from '@/api/recharge'
import { RECHARGE_STORE } from '../utils'

const iStore = useSettingStore()
const uStore = useUserStore()

const customAmount = ref(0)
const selectedAmount = ref(0)
const selectedPayment = ref<RechargeMethod>('wxpay')
const store = inject(RECHARGE_STORE)!

const { t, locale } = useI18n()

const serviceFee = computed(() => {
  const amount = selectedAmount.value || customAmount.value
  return amount < 200 ? Number((amount * 0.01).toFixed(2)) : 0
})

const rechargeAmount = computed(() => {
  return selectedAmount.value || customAmount.value
})

const amountList = [
  { label: '￥10', value: 10 },
  { label: '￥50', value: 50 },
  { label: '￥100', value: 100 },
  { label: '￥200', info: t('recharge.handleFee'), value: 200 },
  { label: '￥500', info: t('recharge.handleFee'), value: 500 },
  { label: '￥1000', info: t('recharge.handleFee'), value: 1000 },
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
  if(!rechargeAmount.value) return toast.warning(t('valid.recharge.amount'))

  const minAmount = +iStore.settings.minRechargeAmount
  const maxAmount = +iStore.settings.maxRechargeAmount

  if (rechargeAmount.value < minAmount) {
    return toast.warning(t('recharge.amount.min', { amount: minAmount }))
  }

  if (rechargeAmount.value > maxAmount) {
    return toast.warning(t('recharge.amount.max', { amount: maxAmount }))
  }

  const response = rechargeApi.create({
    openId: uStore.info.openId,
    type: selectedPayment.value,
    amount: rechargeAmount.value,
    id: 1,
  })

  response.then(({ data }) => {
    if (selectedPayment.value === 'wxpay') {
      store.visible = true
      store.url = data
      checkRecharge()
    }
    if (selectedPayment.value === 'alipay') {
      window.location.href = data
    }
  })
}

function checkRecharge() {
  store.timer = window.setInterval(() => {
    const response = rechargeApi.check()
    response.then(({ data }) => {
      if (!data) return

      toast.success(t('submit.success', { action: t('action.recharge') }))
      uStore.updateCredit()
      store.isComplete = true
      store.refresh = !store.refresh
      window.clearInterval(store.timer)
    })
  }, 1300)
}
</script>

<template>
  <div class="bg-card border p-4 rounded-md space-y-6">
    <div class="space-y-3">
      <h3 class="text-lg font-medium">{{ t('recharge.balance.title') }}</h3>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(108px,1fr))] gap-2">
        <button
          v-for="item in amountList" :key="item.value"
          :class="twMerge(
            'flex flex-col items-center justify-center space-y-1',
            'h-16 rounded-md bg-card border',
            customAmount === item.value && 'ring-2 ring-primary bg-primary/10',
          )"
          @click="selectedAmount = item.value; customAmount = item.value"
        >
          <span>{{ item.label }}</span>
          <span v-if="item.info" class="text-sm text-success">{{ item.info }}</span>
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <PriceInput
          :model-value="customAmount ? customAmount : 0"
          :placeholder="t('recharge.amount.placeholder')"
          @update:model-value="handleCustomAmount"
        />
      </div>
    </div>

    <div class="space-y-3">
      <h3 class="text-lg font-medium">{{ t('recharge.method.title') }}</h3>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(108px,_1fr))] gap-2">
        <button
          :class="twMerge(
            'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
            selectedPayment === 'wxpay' && 'ring-2 ring-primary bg-primary/10',
          )"
          @click="selectedPayment = 'wxpay'"
        >
          <Icon icon="ri:wechat-pay-fill" class="size-6 text-success" />
          <span>{{ t('recharge.method.wechat') }}</span>
        </button>
        <button
          :class="twMerge(
            'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
            selectedPayment === 'alipay' && 'ring-2 ring-primary bg-primary/10',
          )"
          @click="selectedPayment = 'alipay'"
        >
          <Icon icon="ri:alipay-fill" class="size-6 text-primary" />
          <span>{{ t('recharge.method.ali') }}</span>
        </button>
      </div>
    </div>
    
    <div
      v-if="iStore.settings.enablePaymentInfo"
      class="bg-muted p-3 rounded-md"
    >
      <p class="mb-2 font-medium">{{ t('recharge.info.title') }}: </p>
      <div
        class="tiptap text-sm text-muted-foreground"
        v-html="rechargeInfo"
      />
    </div>

    <div class="space-y-2">
      <div class="flex items-center justify-between text-sm text-muted-foreground">
        <span>{{ t('recharge.balance.compAmount.title') }}</span>
        <span>￥{{ rechargeAmount }}</span>
      </div>
      
      <div v-if="serviceFee > 0" class="flex items-center justify-between text-sm text-muted-foreground">
        <span>{{ t('recharge.balance.compAmount.handle') }}(1%)</span>
        <span>￥{{ serviceFee }}</span>
      </div>
      
      <div class="flex items-center justify-between pt-2 border-t">
        <span>{{ t('recharge.balance.compAmount.real') }}</span>
        <span class="text-lg font-medium text-danger">
          ￥{{ (rechargeAmount + serviceFee).toFixed(2) }}
        </span>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <XButton
        :label="t('recharge.button.balance')"
        @click="handleRecharge"
      />
    </div>
  </div>
</template>
