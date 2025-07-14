<script setup lang="ts">
import CardSection from './components/CardSection.vue'
import IncomeSection from './components/IncomeSection.vue'
import OrderSection from './components/OrderSection.vue'
import ServiceSection from './components/ServiceSection.vue'
import UserRanking from './components/UserRanking.vue'
import RealtimeOrderSection from './components/RealtimeOrderSection.vue'

import * as echarts from 'echarts/core'
import { LineChart, BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { UniversalTransition } from 'echarts/features'
import { TooltipComponent, GridComponent } from 'echarts/components'

import dayjs from 'dayjs'

import lightTheme from '@/utils/echarts/light'
import darkTheme from '@/utils/echarts/dark'

import { type StatStore, STORE } from './utils'

echarts.registerTheme('light', lightTheme)
echarts.registerTheme('dark', darkTheme)

echarts.use([
  LineChart,
  BarChart,
  TooltipComponent,
  GridComponent,
  CanvasRenderer,
  UniversalTransition,
])

const today     = dayjs()
const tomorrow  = today.add(1, 'day')
const yesterday = today.subtract(1, 'day')

const store: StatStore = reactive({
  today, tomorrow, yesterday
})

provide(STORE, store)
</script>

<template>
  <div class="p-6 space-y-6">
    <CardSection />

    <div class="flex space-x-6">
      <div class="flex-1 space-y-6">
        <RealtimeOrderSection />
        <OrderSection />
      </div>

      <UserRanking class="flex-shrink-0 min-w-96" />
    </div>

    <div class="flex space-x-6">
      <ServiceSection class="flex-1" />
      <IncomeSection class="flex-1" />
    </div>
  </div>
</template>
