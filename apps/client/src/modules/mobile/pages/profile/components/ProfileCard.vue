<script setup lang="ts">
import { Icon } from '@iconify/vue'

const store = useUserStore()
const visibleInfo = defineModel<boolean>({ required: true })

const order = store.info.userOrder
const accountStats = [
  { label: '余额', value: store.info.credits },
  { label: '总订单', value: order.total },
  { label: '处理中', value: order.total - order.success - order.failed },
]
</script>

<template>
  <section class="mb-3 p-4 bg-card rounded-lg">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-medium">我的账户</h3>
      <button
        class="flex-1 flex items-center justify-end space-x-1 text-sm text-muted-foreground"
        @click="visibleInfo = true"
      >
        详情 <Icon icon="lucide:chevron-right" class="size-4" />
      </button>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="stat in accountStats"
        :key="stat.label"
        class="text-center"
      >
        <div class="text-lg font-medium mb-1">{{ stat.value }}</div>
        <div class="text-sm text-muted-foreground">{{ stat.label }}</div>
      </div>
    </div>
    <div class="flex space-x-2 mt-4">
      <XButton
        class="w-full" icon="lucide:dollar-sign"
        variant="soft" color="danger"
        @click="$router.push('/m/credits')"
      >
        账单
      </XButton>
      <XButton
        class="w-full" icon="lucide:wallet"
        @click="$router.push('/m/recharge')"
      >
        充值
      </XButton>
    </div>
  </section>
</template>
