<script setup lang="ts">
import CardSection from './components/CardSection.vue'
import IncomeSection from './components/IncomeSection.vue'
import OrderSection from './components/OrderSection.vue'
import ServiceSection from './components/ServiceSection.vue'

import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { UniversalTransition } from 'echarts/features'

import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components'

import dayjs from 'dayjs'

import lightTheme from '@/utils/echarts/light'
import darkTheme from '@/utils/echarts/dark'

import { type StatStore, STORE } from './utils'

echarts.registerTheme('light', lightTheme)
echarts.registerTheme('dark', darkTheme)

echarts.use([
  LineChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  CanvasRenderer,
  UniversalTransition,
])

const today = dayjs('2025-04-14')
const tomorrow = today.add(1, 'day')
const yesterday = today.subtract(1, 'day')

const store: StatStore = reactive({
  today,
  tomorrow,
  yesterday,
})

provide(STORE, store)
</script>

<template>
  <div class="p-6 space-y-6">
    <CardSection />
    <IncomeSection />
    <OrderSection />
    <ServiceSection />
  </div>
</template>
