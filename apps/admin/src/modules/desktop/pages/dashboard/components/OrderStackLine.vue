<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import VChart from 'vue-echarts'
import { THEME } from '@3un/utils'

import { STORE } from '../utils'

const theme = inject(THEME)!
const store = inject(STORE)!

const option = ref<EChartsOption>({
  grid: {
    left: 0,
    top: 12,
    right: 0,
    bottom: 2,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    show: false
  },
  xAxis: {
    type: 'time',
    axisLine: {
      lineStyle: {
        color: 'rgba(5, 150, 105, .3)'
      }
    },
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    show: false
  },
  series: [
    {
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: store.orders.map(item => [item.orderTime, item.success]),
      lineStyle: {
        width: 2,
        color: 'rgba(5, 150, 105, 1)'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1, // vertical
          colorStops: [
            {
              offset: 0,
              color: 'rgba(5, 150, 105, .5)'
            },
            {
              offset: 1,
              color: 'rgba(5, 150, 105, .1)'
            }
          ]
        }
      },
    },
    {
      type: 'line',
      smooth: true,
      showSymbol: false,
      data: store.orders.map(item => [item.orderTime, item.failure]),
      lineStyle: {
        width: 2,
        color: 'rgb(220, 38, 38, 0.5)'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1, // vertical
          colorStops: [
            {
              offset: 0,
              color: 'rgb(220, 38, 38, 0.5)'
            },
            {
              offset: 1,
              color: 'rgb(220, 38, 38, 0.1)'
            }
          ]
        }
      },
    },
  ]
})
</script>

<template>
  <VChart
    :option="option"
    :theme="theme.name"
  />
</template>
