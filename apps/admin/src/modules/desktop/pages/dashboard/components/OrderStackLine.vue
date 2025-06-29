<script setup lang="ts">
import type { OrderStatItem } from '@/inters/dashboard'
import type { EChartsOption } from 'echarts'

import VChart from 'vue-echarts'
import { THEME } from '@3un/utils'

interface TheProps {
  data: OrderStatItem[]
}

const props = defineProps<TheProps>()
const theme = inject(THEME)!

const option = computed<EChartsOption>(() => {
  const successRates = props.data.map(item => 
    item.total > 0 ? ((item.success / item.total) * 100) : 0
  )

  const minRate = Math.min(...successRates)
  const maxRate = Math.max(...successRates)
  const range = maxRate - minRate

  const yAxisMin = range < 5 ? Math.max(minRate - 2, 0) : Math.max(minRate - range * 0.1, 0)
  const yAxisMax = range < 5 ? Math.min(maxRate + 2, 100) : Math.min(maxRate + range * 0.1, 100)

  return {
    grid: {
      left: 50,
      top: 16,
      right: 24,
      bottom: 30,
      containLabel: false
    },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (value) => `${Number(value).toFixed(2)}%`
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        fontSize: 11,
        formatter: (value: number) => {
          const date = new Date(value)
          return `${date.getMonth() + 1}/${date.getDate()}`
        }
      },
      axisLine: {
        lineStyle: { color: '#e5e7eb' }
      }
    },
    yAxis: {
      type: 'value',
      name: '成功率',
      nameGap: 8,
      nameLocation: 'start',
      min: yAxisMin,
      max: yAxisMax,
      axisLabel: {
        fontSize: 11,
        formatter: (value: number) => `${value.toFixed(0)}%`
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          opacity: 0.5,
        }
      }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        name: '成功率',
        color: '#059669',
        lineStyle: {
          width: 2,
          color: '#059669'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(5, 150, 105, 0.3)' },
              { offset: 1, color: 'rgba(5, 150, 105, 0.05)' }
            ]
          }
        },
        data: props.data.map((item, idx) => [item.dataTime, successRates[idx]]),
      }
    ]
  }
})
</script>

<template>
  <VChart
    :option="option"
    :theme="theme.name"
    :autoresize="{throttle: 200}"
  />
</template>
