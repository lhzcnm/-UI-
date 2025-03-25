<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

import type { RechargeMethod } from '@/api/recharge'
import type { MemberPackage } from '@/api/member'
import { rechargeApi } from '@/api/recharge'
import { memberApi } from '@/api/member'

interface MembershipItem {
  id: number
  label: string
  amount: number
  saveAmount: string
}

const uStore = useUserStore()
const serviceStore = useServiceStore()

const selectedPlan = ref<MembershipItem>()
const selectedPayment = ref<RechargeMethod>('wxpay')
const memberPkg = ref<MemberPackage[]>([])
const memberList = ref<MembershipItem[]>([])

await Promise.all([
  serviceStore.getServices(),
  getMemberList(),
  getMemberPkg(),
])

async function getMemberList() {
  const { data } = await memberApi.memberList()
  const firstMonth = data[1]

  memberList.value = data.splice(1).map(item => ({
    saveAmount: (firstMonth.price * item.month - item.price).toFixed(2),
    label: `${item.month} 个月`,
    amount: item.price,
    id: item.id,
  }))
}

async function getMemberPkg() {
  const response = await memberApi.memberPkg()
  memberPkg.value = response.data
}

function handleRecharge() {
  if (!selectedPlan.value) return
  const response = rechargeApi.create({
    openId: uStore.info.openId,
    type: selectedPayment.value,
    amount: selectedPlan.value.amount,
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

function isSamePrice(item: MemberPackage) {
  const service = serviceStore.services.get(item.id)
  return service?.price === item.price
}
</script>

<template>
  <div class="bg-card border p-4 rounded-md space-y-4">
    <div class="space-y-3">
      <h3 class="text-lg font-medium">会员套餐</h3>
      <div class="grid grid-cols-3 gap-3">
        <button
          v-for="item in memberList" :key="item.id"
          :class="twMerge(
            'relative flex flex-col items-center justify-center',
            'h-20 rounded-md bg-card border transition-all',
            selectedPlan?.id === item.id && 'ring-2 ring-primary bg-primary/10',
          )"
          @click="selectedPlan = item"
        >
          <div class="text-lg font-medium">{{ item.label }}</div>
          <div class="mt-1 text-lg text-primary">{{ item.amount }}元</div>
          <span 
            v-if="+item.saveAmount > 0" 
            class="absolute -top-2 -right-2 px-2 py-0.5 text-xs bg-rose-500 text-white rounded-full"
          >
            省{{ item.saveAmount }}元
          </span>
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <h3 class="text-lg font-medium">支付方式</h3>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(108px,_1fr))] gap-2">
        <button
          :class="twMerge(
            'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
            selectedPayment === 'wxpay' && 'ring-2 ring-primary bg-primary/10',
          )"
          @click="selectedPayment = 'wxpay'"
        >
          <Icon icon="ri:wechat-pay-fill" class="size-6 text-emerald-500" />
          <span>微信</span>
        </button>
        <button
          :class="twMerge(
            'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
            selectedPayment === 'alipay' && 'ring-2 ring-primary bg-primary/10',
          )"
          @click="selectedPayment = 'alipay'"
        >
          <Icon icon="ri:alipay-fill" class="size-6 text-blue-500" />
          <span>支付宝</span>
        </button>
      </div>
    </div>

    <div class="space-y-3 overflow-y-auto max-h-[400px]">
      <div class="flex items-center justify-between">
        <h3 class="text-lg text-amber-600">会员权益</h3>
        <span class="text-xs text-muted-foreground bg-secondary/70 px-2 py-1 rounded-full">
          开通会员即可享受
        </span>
      </div>

      <div class="divide-y">
        <div 
          v-for="item in memberPkg" :key="item.id"
          class="py-2 first:pt-0"
        >
          <div class="truncate">
            {{ item.id }} - {{ serviceStore.services.get(item.id)!.title }}
          </div>

          <div class="flex justify-between space-x-2 mt-1 text-sm">
            <div
              v-if="item.freeCount"
              class="flex items-center text-primary"
            >
              <Icon icon="ri:time-line" />
              <span class="ml-1">
                免费使用 <b>{{ item.freeCount }} 次/天</b>
              </span>
            </div>

            <div
              v-if="!isSamePrice(item)"
              class="flex items-center text-rose-500"
            >
              <Icon icon="lucide:dollar-sign" />
              <span>优惠价<b>{{ item.price }}</b></span>
              <span class="ml-1.5 text-xs text-muted-foreground align-sub">
                原价{{ serviceStore.services.get(item.id)!.price }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <XButton
        label="立即开通"
        :disabled="!selectedPlan"
        @click="handleRecharge"
      />
    </div>
  </div>
</template>
