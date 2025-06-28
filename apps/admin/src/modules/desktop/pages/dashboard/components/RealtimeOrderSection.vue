<script setup lang="ts">
import RealtimeOrderStackLine from './RealtimeOrderStackLine.vue'

import type { OrderStatItem } from '@/inters/dashboard'
import { formatNumberToThousands } from '@/utils/common'
import { getRealtimeOrder } from '@/api/dashboard'

import dayjs from 'dayjs'

// 后端返回的原始数据
const rawData = ref<OrderStatItem[]>([])
// 前端插值后的显示数据
const displayData = ref<OrderStatItem[]>([])
const lastUpdateTime = ref('')
const isLoading = ref(false)

// 定时器
let fetchTimer: number | null = null
let interpolateTimer: number | null = null

// 计算统计数据
const stats = computed(() => {
  if (displayData.value.length === 0) {
    return { total: 0, success: 0, failure: 0, successRate: 0 }
  }

  const total = displayData.value.reduce((sum, order) => sum + order.total, 0)
  const success = displayData.value.reduce((sum, order) => sum + order.success, 0)
  const failure = displayData.value.reduce((sum, order) => sum + order.failure, 0)
  const successRate = total > 0 ? (success / total) * 100 : 0

  return { total, success, failure, successRate: Number(successRate.toFixed(2)) }
})

// 线性插值函数
function interpolateValue(start: number, end: number, progress: number): number {
  return start + (end - start) * progress
}

// 生成插值数据点
function generateInterpolatedData(): OrderStatItem[] {
  if (rawData.value.length < 2) {
    return rawData.value
  }

  const result: OrderStatItem[] = []
  const now = dayjs()
  
  // 获取当前时间前一分钟作为结束时间（延迟一分钟显示）
  const endTime = now.subtract(1, 'minute')
  const startTime = endTime.subtract(59, 'minute')
  
  // 生成60个数据点（每分钟一个）
  for (let i = 0; i < 60; i++) {
    const currentTime = startTime.add(i, 'minute')
    const timeStr = currentTime.format('YYYY-MM-DD HH:mm:ss')
    
    // 找到对应的原始数据点
    const rawPoint = rawData.value.find(item => 
      dayjs(item.dataTime).isSame(currentTime, 'minute')
    )
    
    if (rawPoint) {
      result.push({
        ...rawPoint,
        dataTime: timeStr
      })
    } else {
      // 如果没有找到对应的数据点，使用插值
      const prevPoint = rawData.value
        .filter(item => dayjs(item.dataTime).isBefore(currentTime))
        .sort((a, b) => dayjs(b.dataTime).valueOf() - dayjs(a.dataTime).valueOf())[0]
      
      const nextPoint = rawData.value
        .filter(item => dayjs(item.dataTime).isAfter(currentTime))
        .sort((a, b) => dayjs(a.dataTime).valueOf() - dayjs(b.dataTime).valueOf())[0]
      
      if (prevPoint && nextPoint) {
        const prevTime = dayjs(prevPoint.dataTime).valueOf()
        const nextTime = dayjs(nextPoint.dataTime).valueOf()
        const currentTimeValue = currentTime.valueOf()
        const progress = (currentTimeValue - prevTime) / (nextTime - prevTime)
        
        result.push({
          total: Math.round(interpolateValue(prevPoint.total, nextPoint.total, progress)),
          success: Math.round(interpolateValue(prevPoint.success, nextPoint.success, progress)),
          failure: Math.round(interpolateValue(prevPoint.failure, nextPoint.failure, progress)),
          dataTime: timeStr
        })
      } else if (prevPoint) {
        // 只有前一个点，使用前一个点的数据
        result.push({
          ...prevPoint,
          dataTime: timeStr
        })
      } else if (nextPoint) {
        // 只有后一个点，使用后一个点的数据
        result.push({
          ...nextPoint,
          dataTime: timeStr
        })
      } else {
        // 没有任何数据点，使用默认值
        result.push({
          total: 0,
          success: 0,
          failure: 0,
          dataTime: timeStr
        })
      }
    }
  }
  
  return result
}

// 更新显示数据（每秒调用）
function updateDisplayData() {
  const interpolatedData = generateInterpolatedData()
  
  // 模拟实时增长效果
  const now = dayjs()
  const currentSecond = now.second()
  
  if (interpolatedData.length > 0) {
    // 获取最后一个数据点，根据当前秒数进行微调
    const lastPoint = interpolatedData[interpolatedData.length - 1]
    const progress = currentSecond / 60 // 0-1 之间的进度
    
    // 轻微增长模拟（可以根据实际需求调整）
    const growthFactor = 1 + (progress * 0.02) // 最多增长2%
    
    const adjustedLastPoint = {
      ...lastPoint,
      total: Math.round(lastPoint.total * growthFactor),
      success: Math.round(lastPoint.success * growthFactor),
      failure: Math.round(lastPoint.failure * growthFactor)
    }
    
    displayData.value = [
      ...interpolatedData.slice(0, -1),
      adjustedLastPoint
    ]
  } else {
    displayData.value = interpolatedData
  }
}

// 获取后端数据
async function fetchData() {
  try {
    isLoading.value = true
    const data = await getRealtimeOrder()
    console.log('realtime data', data)
    
    lastUpdateTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
    rawData.value = data
    
    // 立即更新显示数据
    updateDisplayData()
  } catch (error) {
    console.error('获取实时数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 启动定时器
function startTimers() {
  // 每分钟获取一次数据
  fetchTimer = setInterval(fetchData, 60 * 1000)
  
  // 每秒更新显示数据
  interpolateTimer = setInterval(updateDisplayData, 1000)
}

// 停止定时器
function stopTimers() {
  if (fetchTimer) {
    clearInterval(fetchTimer)
    fetchTimer = null
  }
  if (interpolateTimer) {
    clearInterval(interpolateTimer)
    interpolateTimer = null
  }
}

// 初始化
onMounted(async () => {
  await fetchData()
  startTimers()
})

// 清理
onUnmounted(() => {
  stopTimers()
})
</script>

<template>
  <section class="p-4 border rounded">
    <div class="flex items-center mb-4">
      <h3 class="text-lg font-bold">实时订单统计(最近 60 分钟)</h3>

      <div class="flex items-center space-x-2 text-sm text-muted-foreground ml-auto">
        <span v-if="isLoading" class="text-xs text-blue-500">更新中...</span>
        <span v-if="lastUpdateTime" class="text-xs">最后更新: {{ lastUpdateTime }}</span>
        <span class="text-xs">数据点: {{ displayData.length }}</span>
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
  
      <RealtimeOrderStackLine :data="displayData" class="h-44" />
    </div>
  </section>
</template>
