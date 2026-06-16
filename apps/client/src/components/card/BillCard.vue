<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { InvoiceItem } from '@/api/user'
import { PAYMENT_STATUS_MAP } from '@3un/utils'
import { twMerge } from 'tailwind-merge'

const { item } = defineProps<{ item: InvoiceItem }>()

const { t } = useI18n()
const localStore = useLocalStore()

const isReduce = item.credits.toString().startsWith("-")

// console.log(isNaN(+props.item.credits))
</script>

<template>
  <div class="border rounded-lg bg-card shadow-sm p-4">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm font-medium text-card-foreground">
        {{ item.paymentMethod }}
      </span>
      <XTag
        :color="PAYMENT_STATUS_MAP[item.paymentStatusId].color"
        :label="t(PAYMENT_STATUS_MAP[item.paymentStatusId].key!)"
      />
    </div>

    <div class="flex justify-between">
      <div>
        <div class="flex space-x-1 text-muted-foreground">
          <Icon icon="lucide:credit-card" class="size-4" />
          <span class="text-xs">{{ localStore.localData['credits_BillAmount'] }}</span>
        </div>
        <p class="text-xl font-semibold text-primary">
          ￥{{ item.amount }}
        </p>
      </div>
      <div>
        <div class="flex space-x-1 text-muted-foreground">
          <Icon icon="lucide:coins" class="size-4" />
          <span class="text-xs">{{ localStore.localData['credits_ActualRecevied'] }}</span>
        </div>
        <p
          :class="twMerge(
            'text-lg font-semibold text-success',
            isReduce && 'text-danger'
          )"
        >
          {{ item.credits }}
        </p>
      </div>
    </div>

    <p class="text-xs text-muted-foreground mt-2">
      {{ item.invoiceTime }}
    </p>
  </div>
</template>
