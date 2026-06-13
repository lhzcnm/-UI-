<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

import type { RechargeMethod } from '@/api/recharge'
import type { MemberItem, MemberPackage } from '@/api/member'
import { rechargeApi } from '@/api/recharge'
import { memberApi } from '@/api/member'

const uStore = useUserStore()
const serviceStore = useServiceStore()

const selectedPlan = ref<MemberItem>()
const selectedPayment = ref<RechargeMethod>('wxpay')
const memberPkg = ref<MemberPackage[]>([])
const memberList = ref<MemberItem[]>([])
const pkgTotalAmount = ref<string>('')

const localStore = useLocalStore()

// const mode = import.meta.env.VITE_APP_MODE

// const injectModes = ['Usimlte', 'ZSunlock']

await serviceStore.getServices()
await getMemberList()


async function getMemberList() {
  let { data } = await memberApi.memberList()
  memberList.value = data.slice(1)

  const hasNull = memberList.value.some(item => !item.shopName)

  if(hasNull) {
    data = await getMemberMiniList()
    memberList.value = data
  }

  selectedPlan.value = data[1]
  if(data.length > 1) {
    getMemberPkg(data[1].planId)
  }
}

async function getMemberMiniList() {
  const { data } = await memberApi.memberList({
    headers: {
      'Accept-Language': 'zh'
    }
  })

  return data.slice(1)
}

async function getMemberPkg(id: number) {
  const { data } = await memberApi.memberPkg(id)
  const total = data.reduce((total, item) => {
    if (!item.freeCount || !item.price) return total
    return total + item.price * item.freeCount
  }, 0)

  pkgTotalAmount.value = (total * 30).toFixed(2)
  memberPkg.value = data
}

function handleRecharge() {
  if (!selectedPlan.value) return
  const response = rechargeApi.create({
    openId: uStore.info.openId,
    type: selectedPayment.value,
    amount: selectedPlan.value.price,
    id: selectedPlan.value.id,
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

function pickPlan(item: MemberItem) {
  selectedPlan.value = item
  getMemberPkg(item.planId)
}

function isSamePrice(item: MemberPackage) {
  const service = serviceStore.services.get(item.id)
  return service?.price === item.price
}
</script>

<template>
  <div class="bg-card border p-4 rounded-md space-y-4">
    <div class="space-y-3">
      <h3 class="text-lg font-medium">{{ localStore.localData['recharge_MembershipPlan'] }}</h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="item in memberList" :key="item.id"
          :class="twMerge(
            'relative flex flex-col items-center justify-center',
            'h-20 rounded-md bg-card border transition-all',
            selectedPlan?.id === item.id && 'ring-2 ring-primary bg-primary/10',
          )"
          @click="pickPlan(item)"
        >
          <div class="text-base font-medium">{{ item.shopName }}</div>
          <div class="mt-1 text-lg text-primary">￥{{ item.price }}</div>
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <h3 class="text-lg font-medium">{{ localStore.localData['recharge_PaymentMethod'] }}</h3>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(108px,_1fr))] gap-2">
        <button
          :class="twMerge(
            'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
            selectedPayment === 'wxpay' && 'ring-2 ring-primary bg-primary/10',
          )"
          @click="selectedPayment = 'wxpay'"
        >
          <Icon icon="ri:wechat-pay-fill" class="size-6 text-success" />
          <span>{{ localStore.localData['recharge_WeChatPay'] }}</span>
        </button>
        <button
          :class="twMerge(
            'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
            selectedPayment === 'alipay' && 'ring-2 ring-primary bg-primary/10',
          )"
          @click="selectedPayment = 'alipay'"
        >
          <Icon icon="ri:alipay-fill" class="size-6 text-primary" />
          <span>{{ localStore.localData['recharge_Alipay'] }}</span>
        </button>
      </div>
    </div>

    <div class="space-y-3 overflow-y-auto max-h-[400px]">
      <div class="flex items-center justify-between">
        <h3 class="text-lg text-warning">{{ localStore.localData['recharge_Benefits'] }}</h3>
        <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {{ localStore.localData['recharge_SaveEveryMonth'] }}: <b class="text-danger">￥{{ pkgTotalAmount }}</b>
        </span>
      </div>

      <div class="divide-y">
        <div 
          v-for="item in memberPkg" :key="item.id"
          class="py-2 first:pt-0"
        >
          <div class="truncate">
            {{ item.id }} - {{ serviceStore.services.get(item.id)?.title }}
          </div>

          <div class="space-y-2 mt-1 text-sm">
            <p v-if="item.freeCount" class="text-muted-foreground">
              <span>{{ localStore.localData['recharge_OriginalPrice'].replace('@',item.price) }}</span>
              <span class="text-primary font-bold mx-1">{{ localStore.localData['recharge_Now'].replace('@',item.freeCount) }} </span>
              <span>{{ localStore.localData['recharge_FreeQueries'] }}</span>
              <div v-if="!isSamePrice(item)">
                <span>{{ localStore.localData['recharge_Exceeding'].replace('@',item.freeCount) }}</span>
                <span>{{ localStore.localData['recharge_DiscountPrice'].replace('@',item.price) }}</span>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <XButton
        :label="localStore.localData['recharge_Activate']"
        :disabled="!selectedPlan"
        @click="handleRecharge"
      />
    </div>
  </div>
</template>
