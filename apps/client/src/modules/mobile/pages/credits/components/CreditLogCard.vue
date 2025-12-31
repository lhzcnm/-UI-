<script setup lang="ts">
import type { CreditLogItem } from '@/api/user'
import { twMerge, twJoin } from 'tailwind-merge'

const { item } = defineProps<{ item: CreditLogItem }>()
const store = useServiceStore()
const { t } = useI18n()

// const isSubmit = /提交订单|order|订单提交|Code Request/.test(item.description)
const isReduce = item.credits.toString().startsWith("-")
const service = item.packageId && store.services.get(item.packageId)
const title = getTitle()

function getTitle() {
  if (isReduce) return t('credit.card.out')
  if (item.packageId) return t('credit.card.serviceIn')
  return t('credit.card.pointIn')
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
        <span class="text-sm">{{ t('credit.card.amount') }}</span>
        <div
          :class="twMerge(
            'text-lg font-bold text-success',
            isReduce && 'text-danger',
          )"
        >
          {{ item.credits }}
        </div>
      </div>
      <div class="text-center">
        <span class="text-sm">{{ t('credit.card.balance') }}</span>
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
          {{ t('credit.card.service') }}: {{ item.packageId }} - {{ service.title }}
        </div>
        <div>IMEI/SN: <span class="font-mono">{{ item.imeiNo }}</span></div>
      </template>
      <div v-if="item.ip">IP: <span class="font-mono">{{ item.ip }}</span></div>
      <div v-if="item.comments">{{ t('credit.card.remark') }}: {{ item.comments }}</div>
    </div>
  </div>
</template>
