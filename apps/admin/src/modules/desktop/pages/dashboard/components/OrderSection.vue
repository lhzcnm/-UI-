<script setup lang="ts">
import OrderStackLine from './OrderStackLine.vue'
import OrderSuccessRateChart from './OrderSuccessRateChart.vue'

import type { OrderStatItem } from '@/inters/dashboard'
import { formatNumberToThousands } from '@/utils/common'
import { getOrderRange } from '@/api/dashboard'

import { STORE } from '../utils'

const store = inject(STORE)!

const orders = ref<OrderStatItem[]>([])
const selected = ref('30')

const chartType = ref<'combined' | 'success-rate'>('combined')
const segmentOptions = [
  { label: '组合图表', value: 'combined' },
  { label: '成功率趋势', value: 'success-rate' },
]

const orderStats = computed(() => {
  if (orders.value.length === 0) {
    return { total: 0, success: 0, failure: 0, successRate: 0 }
  }

  const total = orders.value.reduce((sum, order) => sum + order.total, 0)
  const success = orders.value.reduce((sum, order) => sum + order.success, 0)
  const failure = orders.value.reduce((sum, order) => sum + order.failure, 0)
  const successRate = total > 0 ? (success / total) * 100 : 0

  return { total, success, failure, successRate: Number(successRate.toFixed(2)) }
})

await getStatData(selected.value)

async function getStatData(value: string) {
  const startDay = store.tomorrow.subtract(Number(value), 'day')
  const endDay = store.tomorrow

  const data = await getOrderRange({
    startTime: startDay.format('YYYY-MM-DD'),
    endTime: endDay.format('YYYY-MM-DD'),
  })

  console.log('order', data)
  orders.value = data
}
</script>

<template>
  <section class="p-4 border rounded">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold">订单统计</h3>

      <div class="flex items-center space-x-2">
        <XSegmented 
          v-model="chartType" 
          :options="segmentOptions"
        />

        <XSelect
          v-model="selected"
          ui-trigger="w-48"
          @selected="getStatData"
        >
          <XSelectItem value="7">最近7天</XSelectItem>
          <XSelectItem value="30">最近一个月</XSelectItem>
          <XSelectItem value="90">最近三个月</XSelectItem>
          <XSelectItem value="180">最近半年</XSelectItem>
          <XSelectItem value="365">最近一年</XSelectItem>
        </XSelect>
      </div>
    </div>

    <div class="border rounded overflow-hidden">
      <div class="flex divide-x border-b border-dashed">
        <div class="px-4 py-2">
          <div class="text-sm mb-1">总订单数量</div>
          <div class="text-lg font-bold text-primary">
            {{ formatNumberToThousands(orderStats.total) }}
          </div>
        </div>
  
        <div class="px-4 py-2">
          <div class="text-sm mb-1">成功订单数量</div>
          <div class="text-lg font-bold text-success">
            {{ formatNumberToThousands(orderStats.success) }}
          </div>
        </div>
  
        <div class="px-4 py-2">
          <div class="text-sm mb-1">失败订单数量</div>
          <div class="text-lg font-bold text-danger">
            {{ formatNumberToThousands(orderStats.failure) }}
          </div>
        </div>
  
        <div class="px-4 py-2">
          <div class="text-sm mb-1">订单成功率</div>
          <div class="text-lg font-bold text-success">
            {{ orderStats.successRate }}%
          </div>
        </div>
      </div>
  
      <OrderStackLine v-if="chartType === 'combined'" :data="orders" class="h-44" />
      <OrderSuccessRateChart v-else :data="orders" class="h-44" />
    </div>
  </section>
</template>
