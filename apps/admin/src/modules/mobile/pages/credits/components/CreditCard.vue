<script setup lang="ts">
import type { Credit } from '@/inters/credits'
import { twMerge, twJoin } from 'tailwind-merge'

const { item } = defineProps<{ item: Credit }>()
const store = useServiceStore()

const isSubmit = /订单提交|Code Request|提交订单/.test(item.description)
const isReduce = isSubmit || item.description === '管理员扣除积分'
const amountText = isReduce ? `-${Math.abs(item.credits)}` : `+${item.credits}`
const service = item.packageId && store.itemMap.get(item.packageId)
const title = getTitle()

function getTitle() {
  if (isSubmit) return '服务消费'
  if (item.packageId) return '服务退款'
  return '积分充值'
}
</script>

<template>
  <div class="p-4 bg-card rounded-lg border shadow-sm">
    <div class="flex justify-between items-start text-muted-foreground mb-2">
      <div class="flex-1">
        <div class="text-ellipsis font-semibold text-primary">{{ title }}</div>
        <span class="text-sm">{{ item.description }}</span>
      </div>
      <span class="text-xs">{{ item.historyDtTm }}</span>
    </div>

    <div class="grid grid-cols-2 mb-2">
      <div class="text-center">
        <span class="text-sm">变动金额</span>
        <div
          :class="twMerge(
            'text-lg font-bold text-success',
            isReduce && 'text-danger',
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
      <div>ID: {{ item.historyId }}</div>
      <template v-if="service && item.packageId">
        <div class="truncate">服务: {{ item.packageId }} - {{ service.packageTitle }}</div>
        <div>IMEI/SN: <span class="font-mono">{{ item.imeiNo }}</span></div>
      </template>

      <div v-if="item.ip">
        <span>IP地址: </span>
        <span class="font-mono">{{ item.ip }}</span>
      </div>

      <div>所属用户:
        <a
          :href="`/users?uid=${item.userId}`"
          class="underline hover:text-success"
        >
          {{ item.userId }}
        </a>
      </div>

      <div v-if="item.comments">
        <span>备注: </span>
        <span>{{ item.comments }}</span>
      </div>
    </div>
  </div>
</template>
