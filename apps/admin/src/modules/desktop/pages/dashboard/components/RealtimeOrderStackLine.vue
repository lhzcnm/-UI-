<script setup lang="ts">
import type { OrderStatItem } from '@/inters/dashboard'
import type { EChartsOption } from 'echarts'

import dayjs from 'dayjs'
import VChart from 'vue-echarts'
import { THEME } from '@3un/utils'

interface TheProps {
  data: OrderStatItem[]
}

const props = defineProps<TheProps>()
const theme = inject(THEME)!

const option = computed<EChartsOption>(() => {
  return {
    grid: {
      left: 12,
      top: 24,
      right: 12,
      bottom: 12,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'time',
      show: true,
      axisLabel: {
        fontSize: 10,
        formatter: (value: number) => {
          return dayjs(value).format('HH:mm:ss')
        },
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        fontSize: 10,
        formatter: (value: number) => {
          if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'k'
          }
          return value.toString()
        }
      },
      splitLine: { show: false },
      scale: true
    },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: false,
        name: '成功订单',
        color: 'rgba(5, 150, 105, 1)',
        lineStyle: {
          width: 2,
          color: 'rgba(5, 150, 105, 1)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(5, 150, 105, .5)'},
              { offset: 1, color: 'rgba(5, 150, 105, .1)'},
            ]
          }
        },
        data: props.data.map(item => [item.dataTime, item.success]),
      },
      {
        type: 'line',
        smooth: true,
        showSymbol: false,
        name: '失败订单',
        color: 'rgb(220, 38, 38, 1)',
        lineStyle: {
          width: 2,
          color: 'rgb(220, 38, 38, 0.8)'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgb(220, 38, 38, 0.5)'},
              { offset: 1, color: 'rgb(220, 38, 38, 0.1)'},
            ]
          }
        },
        data: props.data.map(item => [item.dataTime, item.failure]),
      },
    ]
  }
})
</script>

<template>
  <VChart
    :option="option"
    :theme="theme.name"
    :autoresize="{throttle: 200}"
    class="h-36 w-full"
  />
</template>
