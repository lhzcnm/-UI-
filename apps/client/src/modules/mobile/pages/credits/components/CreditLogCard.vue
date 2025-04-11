<script setup lang="ts">
import type { CreditLogItem } from '@/api/user'
import { twMerge, twJoin } from 'tailwind-merge'

const { item } = defineProps<{ item: CreditLogItem }>()
const store = useServiceStore()

const isSubmit = /订单提交|Code Request/.test(item.description)
const isReduce = isSubmit || item.description === '管理员扣除积分'
const amountText = isReduce ? `-${Math.abs(item.credits)}` : `+${item.credits}`
const service = item.packageId && store.services.get(item.packageId)
const title = getTitle()

function getTitle() {
  if (isSubmit) return '服务消费'
  if (item.packageId) return '服务退款'
  return '积分充值'
}
</script>

<template>
  <div class="p-4 bg-card rounded-lg border shadow-sm">
    <div class="flex justify-between items-start mb-2">
      <div class="flex-1">
        <div class="text-ellipsis font-semibold text-primary">
          {{ title }}
        </div>
        <span class="text-sm text-muted-foreground">
          {{ item.description }}
        </span>
      </div>
      <span class="text-xs text-muted-foreground">
        {{ item.historyDtTm }}
      </span>
    </div>

    <div class="grid grid-cols-2 mb-2">
      <div class="text-center">
        <span class="text-sm">变动金额</span>
        <div
          :class="twMerge(
            'text-lg font-bold text-emerald-500',
            isReduce && 'text-rose-500',
          )"
        >
          {{ amountText }}
        </div>
      </div>
      <div class="text-center">
        <span class="text-sm">余额</span>
        <div class="text-lg font-bold text-primary">
          {{ item.creditsLeft }}
        </div>
      </div>
    </div>

    <div
      :class="twJoin(
        'space-y-1 p-2 bg-muted overflow-x-auto',
        'rounded-lg text-xs text-muted-foreground',
        'empty:hidden'
      )"
    >
      <template v-if="service && item.packageId">
        <div class="truncate">
          服务: {{ item.packageId }} - {{ service.title }}
        </div>
        <div>IMEI/SN: <span class="font-mono">{{ item.imeiNo }}</span></div>
      </template>
      <div v-if="item.ip">IP地址: <span class="font-mono">{{ item.ip }}</span></div>
      <div v-if="item.comments">备注: {{ item.comments }}</div>
    </div>
  </div>
</template>
