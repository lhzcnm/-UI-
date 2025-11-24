<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { twMerge } from 'tailwind-merge'

type PayMethod = 'wxpay' | 'alipay'

const method = defineModel<PayMethod>({ required: true })

const { t } = useI18n()
</script>

<template>
  <div class="space-y-3">
    <h3 class="text-lg font-medium">{{ t('shop.pay.title') }}</h3>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(108px,_1fr))] gap-2">
      <button
        :class="twMerge(
          'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
          method === 'wxpay' && 'ring-2 ring-primary bg-primary/10',
        )"
        @click="method = 'wxpay'"
      >
        <Icon icon="ri:wechat-pay-fill" class="size-6 text-success" />
        <span>{{ t('shop.pay.wx') }}</span>
      </button>
      <button
        :class="twMerge(
          'flex flex-col items-center justify-center space-y-1 h-16 rounded-md bg-card border',
          method === 'alipay' && 'ring-2 ring-primary bg-primary/10',
        )"
        @click="method = 'alipay'"
      >
        <Icon icon="ri:alipay-fill" class="size-6 text-primary" />
        <span>{{ t('shop.pay.ali') }}</span>
      </button>
    </div>
  </div>
</template>
