<script setup lang="ts">
import TrendChart from './TrendChart.vue'

import { twMerge } from 'tailwind-merge'
import { Icon, type IconifyIcon } from '@iconify/vue'

import { formatNumberToThousands } from '@/utils/common'

interface StatCardProps {
  title: string
  today: string | number
  yesterday: string | number
  icon: string | IconifyIcon
  data: [string, number][]
}

const { title, today, yesterday, icon, data } = defineProps<StatCardProps>()
const growth = computed(() => estimateGrowth(today, yesterday))

function estimateGrowth(
  todaySoFar: number | string,
  yesterdayTotal: number | string
) {
  const now = new Date()
  const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes()
  const ratio = minutesSinceMidnight / 1440 // 1440 = 24 * 60

  const estimatedYesterdayToNow = +yesterdayTotal * ratio

  if (estimatedYesterdayToNow === 0) {
    return { rate: '0.00', increase: false }
  }

  const diff = +todaySoFar - estimatedYesterdayToNow
  const growth = (diff / estimatedYesterdayToNow) * 100

  return {
    rate: growth.toFixed(1),
    increase: diff > 0,
  }
}
</script>

<template>
  <div class="border bg-card rounded overflow-hidden">
    <div class="flex items-center justify-between border-b border-dashed p-3">
      <div class="flex items-center space-x-2">
        <Icon :icon="icon" class="size-5" />
        <div class="text-base">{{ title }}</div>
      </div>
    </div>

    <div class="flex items-center justify-between p-3 pb-0">
      <div class="text-2xl font-bold">
        {{ formatNumberToThousands(Number(today)) }}
      </div>
      <div class="text-sm text-muted-foreground">
        <span :class="twMerge('mr-1 text-danger', growth.increase && 'text-success')">
          {{ growth.rate }}%
        </span>

        <span class="text-muted-foreground">较昨日</span>
      </div>
    </div>

    <TrendChart v-if="data" :data="data" class="h-16" />
  </div>
</template>
