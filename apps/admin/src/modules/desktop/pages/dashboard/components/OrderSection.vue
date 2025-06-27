<script setup lang="ts">
import OrderStackLine from './OrderStackLine.vue'

import type { StatOrder } from '@/inters/dashboard'
import { getOrder } from '@/api/dashboard'
import { STORE } from '../utils'
import { formatNumberToThousands } from '@/utils/common'

const store = inject(STORE)!

const selected = ref('7')
const orders = ref<StatOrder[]>([])

const orderStats = computed(() => {
  if (orders.value.length === 0) {
    return {
      totalOrders: 0,
      successOrders: 0,
      failureOrders: 0,
      processingOrders: 0,
      awaitingOrders: 0,
      successRate: 0
    }
  }
  
  const totalOrders = orders.value.reduce((sum, order) => sum + order.total, 0)
  const successOrders = orders.value.reduce((sum, order) => sum + order.success, 0)
  const failureOrders = orders.value.reduce((sum, order) => sum + order.failure, 0)
  const processingOrders = orders.value.reduce((sum, order) => sum + order.processing, 0)
  const awaitingOrders = orders.value.reduce((sum, order) => sum + order.awaiting, 0)
  
  const successRate = totalOrders > 0 ? (successOrders / totalOrders) * 100 : 0
  
  return {
    totalOrders,
    successOrders,
    failureOrders,
    processingOrders,
    awaitingOrders,
    successRate: Number(successRate.toFixed(2))
  }
})

await getOrderStat(selected.value)

async function getOrderStat(value: string) {
  const startDay = store.tomorrow.subtract(Number(value), 'day')
  const endDay = store.tomorrow

  const data = await getOrder({
    startTime: startDay.format('YYYY-MM-DD'),
    endTime: endDay.format('YYYY-MM-DD'),
  })

  console.log('order', data)
  orders.value = data
}
</script>

<template>
  <section class="border p-4 rounded">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold">订单统计</h3>

      <div class="flex items-center space-x-2">
        <XSelect
          v-model="selected"
          ui-trigger="w-48"
          @selected="getOrderStat"
        >
          <XSelectItem value="7">最近7天</XSelectItem>
          <XSelectItem value="30">最近一个月</XSelectItem>
          <XSelectItem value="90">最近三个月</XSelectItem>
          <XSelectItem value="180">最近半年</XSelectItem>
          <XSelectItem value="365">最近一年</XSelectItem>
        </XSelect>
      </div>
    </div>

    <div class="flex space-x-4 mb-4">
      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">总订单数量</div>
        <div class="text-lg font-bold text-primary">
          {{ formatNumberToThousands(orderStats.totalOrders) }}
        </div>
      </div>

      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">成功订单数量</div>
        <div class="text-lg font-bold text-success">
          {{ formatNumberToThousands(orderStats.successOrders) }}
        </div>
      </div>

      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">失败订单数量</div>
        <div class="text-lg font-bold text-danger">
          {{ formatNumberToThousands(orderStats.failureOrders) }}
        </div>
      </div>

      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">订单成功率</div>
        <div class="text-lg font-bold text-success">
          {{ orderStats.successRate }}%
        </div>
      </div>
    </div>

    <div class="border rounded overflow-hidden">
      <OrderStackLine :data="orders" class="h-36" />
    </div>
  </section>
</template>
