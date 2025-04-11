<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { twMerge } from 'tailwind-merge'

import type { RechargeMethod } from '@/api/recharge'
import type { MemberPackage } from '@/api/member'
import { rechargeApi } from '@/api/recharge'
import { memberApi } from '@/api/member'
import { RECHARGE_STORE } from '../utils'

interface MembershipItem {
  id: number
  label: string
  amount: number
  saveAmount: string
}

const uStore = useUserStore()
const serviceStore = useServiceStore()
await serviceStore.getServices()

const timer = ref(0)
const selectedPlan = ref<MembershipItem>()
const selectedPayment = ref<RechargeMethod>('wxpay')

const memberPkg = ref<MemberPackage[]>([])
const memberList = ref<MembershipItem[]>([])
const pkgTotalAmount = ref(0)

const store = inject(RECHARGE_STORE)!

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
  const { data } = await memberApi.memberPkg()
  const total = data.reduce((total, item) => {
    if (!item.freeCount || !item.price) return total
    return total + item.price * item.freeCount
  }, 0)

  pkgTotalAmount.value = total * 30
  memberPkg.value = data
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
  timer.value = window.setInterval(() => {
    const response = rechargeApi.check()
    response.then(({ data }) => {
      if (!data) return

      toast.success('充值成功')
      uStore.updateCredit()
      store.isComplete = true
      window.clearInterval(timer.value)
    })
  }, 1300)
}

function isSamePrice(item: MemberPackage) {
  const service = serviceStore.services.get(item.id)
  return service?.price === item.price
}
</script>

<template>
  <div class="bg-card border p-4 rounded-md space-y-6">
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
        <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          每月最高将为您节省：<b class="text-rose-500">{{ pkgTotalAmount }}元</b>
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
            <p v-if="item.freeCount" class="text-muted-foreground">
              <span>原价{{ item.price }}元/次。现在</span>
              <span class="text-primary font-bold">每天 {{ item.freeCount }} 次</span>
              <span>免费查询</span>
              <div v-if="!isSamePrice(item)">
                <span>超过 {{ item.freeCount }} 次，则使用</span>
                <span>优惠价{{ item.price }}/次</span>
              </div>
            </p>
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
