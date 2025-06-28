<script setup lang="ts">
import TodayStatCard from './TodayStatCard.vue'

import { getIncomeRange, getOrderRange, getIncomeTrend, getOrderTrend } from '@/api/dashboard'
import { STORE } from '../utils'

const store = inject(STORE)!

const incomeToday = ref('0')
const incomeYesterday = ref('0')

const orderToday = ref(0)
const orderYesterday = ref(0)

const incomeTrend = ref<Array<[string, number]>>([])
const orderTrend = ref<Array<[string, number]>>([])

await Promise.all([
  getIncomeStat(),
  getOrderStat(),

  getIncomeTrendStat(),
  getOrderTrendStat(),
])

async function getIncomeStat() {
  const data = await getIncomeRange({
    startTime: store.yesterday.format('YYYY-MM-DD'),
    endTime: store.tomorrow.format('YYYY-MM-DD'),
  })

  console.log('income', data)

  const todayDate = store.today.format('YYYY-MM-DD')
  const yesterdayDate = store.yesterday.format('YYYY-MM-DD')

  incomeToday.value = data[todayDate]
  incomeYesterday.value = data[yesterdayDate]
}

async function getOrderStat() {
  const data = await getOrderRange({
    startTime: store.yesterday.format('YYYY-MM-DD'),
    endTime: store.tomorrow.format('YYYY-MM-DD'),
  })

  console.log('order', data)

  orderToday.value = data[1].total
  orderYesterday.value = data[0].total
}

async function getIncomeTrendStat() {
  const data = await getIncomeTrend()
  console.log('incomeTrend', data)

  incomeTrend.value = Object.entries(data)
    .map(([key, value]) => [key, Number(value)])
}

async function getOrderTrendStat() {
  const data = await getOrderTrend()
  console.log('orderTrend', data)

  orderTrend.value = Object.entries(data)
    .map(([key, value]) => [key, Number(value)])
}
</script>

<template>
  <section class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
    <TodayStatCard
      title="今日收入"
      :data="incomeTrend"
      :today="incomeToday"
      :yesterday="incomeYesterday"
      icon="lucide:dollar-sign"
    />

    <TodayStatCard
      title="今日订单"
      :data="orderTrend"
      :today="orderToday"
      :yesterday="orderYesterday"
      icon="lucide:shopping-cart"
    />
  </section>
</template>
