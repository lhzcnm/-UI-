<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { toast } from 'vue-sonner'
import { twMerge } from 'tailwind-merge'

import type { RechargeMethod } from '@/api/recharge'
import type { MemberItem, MemberPackage } from '@/api/member'
import { rechargeApi } from '@/api/recharge'
import { memberApi } from '@/api/member'
import { RECHARGE_STORE } from '../utils'

const uStore = useUserStore()
const serviceStore = useServiceStore()

const timer = ref(0)
const selectedPlan = ref<MemberItem>()
const selectedPayment = ref<RechargeMethod>('wxpay')

const memberPkg = ref<MemberPackage[]>([])
const memberList = ref<MemberItem[]>([])
const pkgTotalAmount = ref<string>('')

const { t } = useI18n()

const store = inject(RECHARGE_STORE)!

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
  getMemberPkg(data[1].planId)
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

      toast.success(t('submit.success', { action: t('action.recharge') }))
      uStore.updateCredit()
      store.isComplete = true
      window.clearInterval(timer.value)
    })
  }, 1300)
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
  <div class="bg-card border p-4 rounded-md space-y-6">
    <div class="space-y-3">
      <h3 class="text-lg font-medium">{{ t('recharge.member.title') }}</h3>
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

    <div class="space-y-3 overflow-y-auto max-h-[400px]">
      <div class="flex items-center justify-between">
        <h3 class="text-lg text-warning">{{ t('recharge.member.rights.title') }}</h3>
        <span class="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
          {{ t('recharge.member.rights.text1') }}: <b class="text-danger">{{ pkgTotalAmount }}元</b>
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

          <div class="flex justify-between space-x-2 mt-1 text-sm">
            <p v-if="item.freeCount" class="text-muted-foreground">
              <span>{{ t('recharge.member.rights.text2', { price: item.price }) }}</span>
              <span class="text-primary font-bold">{{ t('recharge.member.rights.text3', { count: item.freeCount }) }}</span>
              <span>{{ t('recharge.member.rights.text4') }}</span>
              <div v-if="!isSamePrice(item)">
                <span>{{ t('recharge.member.rights.text5', { count: item.freeCount }) }}</span>
                <span>{{ t('recharge.member.rights.text6', { price: item.price }) }}</span>
              </div>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-end">
      <XButton
        :label="t('recharge.button.member')"
        :disabled="!selectedPlan"
        @click="handleRecharge"
      />
    </div>
  </div>
</template>
