<script setup lang="ts">
import RealtimeOrderStackLine from './RealtimeOrderStackLine.vue'

import type { OrderStatItem } from '@/inters/dashboard'
import { formatNumberToThousands } from '@/utils/common'
import { getRealtimeOrder } from '@/api/dashboard'

import dayjs from 'dayjs'

const realtimeData = ref<OrderStatItem[]>([])
const animatedData = ref<OrderStatItem[]>([])
const lastUpdateTime = ref('')

const stats = computed(() => {
  if (realtimeData.value.length === 0) {
    return { total: 0, success: 0, failure: 0, successRate: 0 }
  }

  const total = realtimeData.value.reduce((sum, order) => sum + order.total, 0)
  const success = realtimeData.value.reduce((sum, order) => sum + order.success, 0)
  const failure = realtimeData.value.reduce((sum, order) => sum + order.failure, 0)
  const successRate = total > 0 ? (success / total) * 100 : 0

  return { total, success, failure, successRate: Number(successRate.toFixed(2)) }
})

await getStatData()

async function getStatData() {
  const data = await getRealtimeOrder()
  console.log('realtime data', data)

  realtimeData.value = data
  lastUpdateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}
</script>

<template>
  <section class="p-4 border rounded">
    <div class="flex items-center mb-4">
      <h3 class="text-xl font-bold">实时订单统计(最近 60 分钟)</h3>

      <div class="flex items-center space-x-2 text-sm text-muted-foreground ml-auto">
        <span v-if="lastUpdateTime" class="text-xs">最后更新: {{ lastUpdateTime }}</span>
        <span class="text-xs">数据点: {{ realtimeData.length }}</span>
      </div>
    </div>

    <div class="border rounded overflow-hidden">
      <div class="flex divide-x border-b border-dashed">
        <div class="px-4 py-2">
          <div class="text-sm mb-1">总订单数量</div>
          <div class="text-lg font-bold text-primary">
            {{ formatNumberToThousands(stats.total) }}
          </div>
        </div>
  
        <div class="px-4 py-2">
          <div class="text-sm mb-1">成功订单数量</div>
          <div class="text-lg font-bold text-success">
            {{ formatNumberToThousands(stats.success) }}
          </div>
        </div>
  
        <div class="px-4 py-2">
          <div class="text-sm mb-1">失败订单数量</div>
          <div class="text-lg font-bold text-danger">
            {{ formatNumberToThousands(stats.failure) }}
          </div>
        </div>
  
        <div class="px-4 py-2">
          <div class="text-sm mb-1">订单成功率</div>
          <div class="text-lg font-bold text-success">
            {{ stats.successRate }}%
          </div>
        </div>
      </div>
  
      <RealtimeOrderStackLine :data="realtimeData" class="h-44" />
    </div>
  </section>
</template>
