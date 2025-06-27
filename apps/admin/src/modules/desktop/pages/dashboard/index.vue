<script setup lang="ts">
import TodayStatCard from './components/TodayStatCard.vue'
import IncomeStackLine from './components/IncomeStackLine.vue'
import RangeStatSection from './components/RangeStatSection.vue'
import OrderStackLine from './components/OrderStackLine.vue'

import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { UniversalTransition } from 'echarts/features'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'

import dayjs, { Dayjs } from 'dayjs'

import lightTheme from '@/utils/echarts/light'
import darkTheme from '@/utils/echarts/dark'

import { getIncome, getIncomeTrend, getOrder, getOrderTrend, getService } from '@/api/dashboard'

import type { StatStore } from './utils'
import { STORE } from './utils'

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
  extraInfo: {
    incomeToday    : '0',
    incomeYesterday: '0',
    orderToday     : 0,
    orderYesterday : 0,
  },
  income      : {},
  orders      : [],
  services    : [],
  incomeTrend : [],
  orderTrend  : [],
})

provide(STORE, store)

const today = dayjs('2025-04-14')
const tomorrow = today.add(1, 'day')
const yesterday = today.subtract(1, 'day')

await Promise.all([
  getIncomeStat(),
  getIncomeTrendStat(),

  getOrderStat(),
  getOrderTrendStat(),

  getServiceStat(),
])

async function getIncomeStat() {
  const dateFormat = 'YYYY-MM-DD'

  const startDay = tomorrow.subtract(1, 'week')
  const endDay = tomorrow

  const data = await getIncome({
    startTime: startDay.format(dateFormat),
    endTime: endDay.format(dateFormat),
  })

  const patchedData = patchData(startDay, endDay, data)
  const todayDate = today.format(dateFormat)
  const yesterdayDate = yesterday.format(dateFormat)
  console.log('income', patchedData)

  store.income = patchedData
  store.extraInfo.incomeToday = data[todayDate]
  store.extraInfo.incomeYesterday = data[yesterdayDate]
}

async function getIncomeTrendStat() {
  const data = await getIncomeTrend()

  console.log('incomeTrend', data)
  store.incomeTrend = Object.entries(data)
    .map(([key, value]) => [key, Number(value)])
}

async function getOrderStat() {
  const format = 'YYYY-MM-DD'

  const startDay = tomorrow.subtract(1, 'week')
  const endDay = tomorrow

  const data = await getOrder({
    startTime: startDay.format(format),
    endTime: endDay.format(format),
  })

  console.log('order', data)
  const todayDate = today.format(format)
  const yesterdayDate = yesterday.format(format)

  const todayIndex = data.findIndex((item) => item.orderTime === todayDate)
  const yesterdayIndex = data.findIndex((item) => item.orderTime === yesterdayDate)

  store.orders = data

  if (todayIndex !== -1 && yesterdayIndex !== -1) {
    store.extraInfo.orderToday = data[todayIndex].total
    store.extraInfo.orderYesterday = data[yesterdayIndex].total
  }
}

async function getOrderTrendStat() {
  const data = await getOrderTrend()

  console.log('orderTrend', data)
  store.orderTrend = Object.entries(data)
    .map(([key, value]) => [key, Number(value)])
}

async function getServiceStat() {
  const dateFormat = 'YYYY-MM-DD'

  const startDay = tomorrow.subtract(1, 'week')
  const endDay = tomorrow

  const data = await getService({
    startTime: startDay.format(dateFormat),
    endTime: endDay.format(dateFormat),
    serviceId: 1046
  })

  console.log('service', data)
  store.services = data
}

async function handleIncomeSelected(value: string) {
  const startDay = tomorrow.subtract(Number(value), 'day')
  const endDay = tomorrow

  const dateFormat = 'YYYY-MM-DD'
  
  const data = await getIncome({
    startTime: startDay.format(dateFormat),
    endTime: endDay.format(dateFormat),
  })

  const patchedData = patchData(startDay, endDay, data)
  console.log('income', patchedData)

  store.income = patchedData
}

async function handleOrderSelected(value: string) {
  const startDay = tomorrow.subtract(Number(value), 'day')
  const endDay = tomorrow

  const dateFormat = 'YYYY-MM-DD'

  const data = await getOrder({
    startTime: startDay.format(dateFormat),
    endTime: endDay.format(dateFormat),
  })

  console.log('order', data)
  store.orders = data
}

function patchData(
  startDay: Dayjs,
  endDay: Dayjs,
  data: Record<string, string>
) {
  const diff = endDay.diff(startDay, 'day')
  const result: Record<string, string> = {}
  const format = 'YYYY-MM-DD'
  
  for (let i = 0; i < diff; i++) {
    const day = startDay.add(i, 'day').format(format)

    if (day in data) result[day] = data[day]
    else result[day] = '0'
  }

  return result
}
</script>

<template>
  <div class="p-6 space-y-6">
    <section class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      <TodayStatCard
        title="今日收入"
        :data="store.incomeTrend"
        :today="store.extraInfo.incomeToday"
        :yesterday="store.extraInfo.incomeYesterday"
        icon="lucide:dollar-sign"
      />

      <TodayStatCard
        title="今日订单"
        :data="store.orderTrend"
        :today="store.extraInfo.orderToday"
        :yesterday="store.extraInfo.orderYesterday"
        icon="lucide:shopping-cart"
      />
    </section>

    <RangeStatSection title="充值统计" :selected="handleIncomeSelected">
      <IncomeStackLine class="h-48 rounded-lg border overflow-hidden" />
    </RangeStatSection>

    <RangeStatSection title="订单统计" :selected="handleOrderSelected">
      <OrderStackLine class="h-48 rounded-lg border overflow-hidden" />
    </RangeStatSection>
  </div>
</template>
