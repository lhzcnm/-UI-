<script setup lang="ts">
import TodayStatCard from './TodayStatCard.vue'

import { getIncomeRange, getOrderRange, getIncomeTrend, getOrderTrend, getUserToday } from '@/api/dashboard'
import { STORE } from '../utils'

const store = inject(STORE)!

const incomeToday = ref('0')
const incomeYesterday = ref('0')

const orderToday = ref(0)
const orderYesterday = ref(0)

const userToday = ref(0)
const userYesterday = ref(0)

const incomeTrend = ref<Array<[string, number]>>([])
const orderTrend = ref<Array<[string, number]>>([])

await Promise.all([
  getIncomeStat(),
  getOrderStat(),

  getIncomeTrendStat(),
  getOrderTrendStat(),

  getUserStat(),
])

async function getIncomeStat() {
  const data = await getIncomeRange({
    startTime: store.yesterday.format('YYYY-MM-DD'),
    endTime: store.tomorrow.format('YYYY-MM-DD'),
  })

  const todayDate = store.today.format('YYYY-MM-DD')
  const yesterdayDate = store.yesterday.format('YYYY-MM-DD')

  incomeToday.value = data[todayDate] || '0'
  incomeYesterday.value = data[yesterdayDate] || '0'
}

async function getOrderStat() {
  const data = await getOrderRange({
    startTime: store.yesterday.format('YYYY-MM-DD'),
    endTime: store.tomorrow.format('YYYY-MM-DD'),
  })

  if (data.length === 2) {
    orderToday.value = data[1].total
    orderYesterday.value = data[0].total
  }
  else {
    orderToday.value = 0
    orderYesterday.value = 0
  }
}

async function getIncomeTrendStat() {
  const data = await getIncomeTrend()

  incomeTrend.value = Object.entries(data)
    .map(([key, value]) => [key, Number(value)])
}

async function getOrderTrendStat() {
  const data = await getOrderTrend()

  orderTrend.value = Object.entries(data)
    .map(([key, value]) => [key, Number(value)])
}

async function getUserStat() {
  const data = await getUserToday()

  userToday.value = data.today || 0
  userYesterday.value = data.yesterday || 0
}
</script>

<template>
  <section class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
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

    <TodayStatCard
      title="今日用户"
      :data="[]"
      :today="userToday"
      :yesterday="userYesterday"
      icon="lucide:users"
    />
  </section>
</template>
