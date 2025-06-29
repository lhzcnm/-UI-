<script setup lang="ts">
import RealtimeOrderStackLine from './RealtimeOrderStackLine.vue'

import type { OrderStatItem } from '@/inters/dashboard'
import { formatNumberToThousands } from '@/utils/common'
import { getRealtimeOrder } from '@/api/dashboard'

import dayjs from 'dayjs'

const rawData = ref<OrderStatItem[]>([])
const displayData = ref<OrderStatItem[]>([])
const lastUpdateTime = ref('')

let fetchTimer: number | null = null
let displayTimer: number | null = null

const stats = computed(() => {
  const carry = { total: 0, success: 0, failure: 0 }
  if (rawData.value.length === 0) {
    return { ...carry, successRate: 0 }
  }

  for (const item of rawData.value) {
    carry.total += item.total
    carry.success += item.success
    carry.failure += item.failure
  }

  const successRate = carry.total > 0 ? (carry.success / carry.total) * 100 : 0
  return { ...carry, successRate: Number(successRate.toFixed(2)) }
})

await getStatData()

onUnmounted(() => stopTimers())

async function getStatData() {
  stopTimers()

  const data = await getRealtimeOrder()
  const isEmpty = rawData.value.length === 0
  const slicedData = data.slice(isEmpty ? -2 : -1)
  rawData.value = rawData.value.concat(slicedData).slice(-10)

  console.log('raw Data', rawData.value)
  lastUpdateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')

  startTimers()
}

function startTimers() {
  fetchTimer = setTimeout(getStatData, 60 * 1000)
  let data: OrderStatItem[] = []

  if (displayData.value.length > 0) {
    const prevLastItem = displayData.value[displayData.value.length - 1]
    const lastTime = prevLastItem.dataTime
  
    data = rawData.value.filter(item => item.dataTime > lastTime)
  }
  else {
    data = rawData.value
  }

  const processedData = handleDisplayData(data)

  console.log('data', processedData)
  updateDisplayData(processedData)
}

function stopTimers() {
  if (fetchTimer) {
    clearInterval(fetchTimer)
    fetchTimer = null
  }
  if (displayTimer) {
    clearInterval(displayTimer)
    displayTimer = null
  }
}

function handleDisplayData(data: OrderStatItem[]) {
  const lastItem = data[data.length - 1]
  const format = 'YYYY-MM-DD HH:mm:ss'
  const result: OrderStatItem[] = []

  for (let i = 0; i < data.length - 1; i++) {
    const nextItem = data[i + 1] || lastItem
    const item = data[i]

    const itemTime = dayjs(item.dataTime)
    const totalRate = (nextItem.total - item.total) / 60
    const successRate = (nextItem.success - item.success) / 60
    const failureRate = (nextItem.failure - item.failure) / 60

    result.push(item)

    for (let j = 5; j < 60; j += 5) {
      const currentTime = itemTime.add(j, 'second')

      result.push({
        dataTime: currentTime.format(format),
        total: Math.round(item.total + totalRate * j),
        success: Math.round(item.success + successRate * j),
        failure: Math.round(item.failure + failureRate * j),
      })
    }
  }

  return result
}

function updateDisplayData(data: OrderStatItem[]) {
  const item = data.shift()

  if (item) {
    console.log('item0', item)
    displayData.value.push(item)
  }

  displayTimer = setInterval(() => {
    const item = data.shift()

    if (item) {
      console.log('item', item)
      displayData.value.push(item)
    }
  }, 5 * 1000)
}
</script>

<template>
  <section class="border rounded">
    <div class="flex items-center p-3 border-b">
      <h3 class="text-lg font-bold">实时订单统计</h3>

      <div class="flex items-center space-x-2 text-sm text-muted-foreground ml-auto">
        <span v-if="lastUpdateTime" class="text-xs">最后更新: {{ lastUpdateTime }}</span>
        <span class="text-xs">数据点: {{ displayData.length }}</span>
        <span class="text-xs text-orange-500">延时1分钟</span>
      </div>
    </div>

    <div class="flex flex-col h-64 overflow-hidden">
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
  
      <RealtimeOrderStackLine :data="displayData" class="flex-1" />
    </div>
  </section>
</template>
