<script setup lang="ts">
import TodayStatCard from './components/TodayStatCard.vue'
import OrderStackLine from './components/OrderStackLine.vue'

import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { UniversalTransition } from 'echarts/features'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'

import dayjs from 'dayjs'

import lightTheme from '@/utils/echarts/light'
import darkTheme from '@/utils/echarts/dark'

import { getIncome, getOrder, getService } from '@/api/dashboard'

import { STORE, type StatStore } from './utils'

echarts.registerTheme('light', lightTheme)
echarts.registerTheme('dark', darkTheme)

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
  UniversalTransition,
])

const store: StatStore = reactive({
  income      : {},
  orders      : [],
  services    : [],
  incomeTrend : [],
  orderTrend  : [],
})

provide(STORE, store)

const todayDate = dayjs().format('YYYY-MM-DD')
const tomorrowDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
const yesterdayDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')

await Promise.all([
  getIncomeStat(),
  getOrderStat(),
  getServiceStat(),
])

async function getIncomeStat() {
  const data = await getIncome({
    startTime: '2025-05-01',
    endTime: tomorrowDate
  })
  
  console.log('income', data)
  store.income = data
  store.incomeTrend = Object.entries(data)
    .map(([key, value]) => [key, Number(value)])
}

async function getOrderStat() {
  const data = await getOrder({
    startTime: '2025-04-01',
    endTime: '2025-04-15'
  })

  console.log('orders', data)
  store.orders = data
  store.orderTrend = data.map((item: any) => [item.orderTime, item.total])
}

async function getServiceStat() {
  const data = await getService({
    startTime: '2025-04-01',
    endTime: '2025-04-15',
    serviceId: 1046,
  })
  console.log('services', data)
  store.services = data
}
</script>

<template>
  <div class="p-6 space-y-6">
    <section class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
      <TodayStatCard
        title="今日收入"
        :today="1590"
        :yesterday="1297"
        icon="lucide:credit-card"
      >
      </TodayStatCard>

      <TodayStatCard
        title="今日订单"
        :today="9945"
        :yesterday="15345"
        icon="lucide:credit-card"
      >
      </TodayStatCard>
    </section>

    <section>
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-medium">订单统计</h3>
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-500">2025-05-01</span>
          <span class="text-sm text-gray-500">2025-05-31</span>
        </div>
      </div>

      <OrderStackLine
        class="h-24 rounded-lg border overflow-hidden"
      />
    </section>
  </div>
</template>
