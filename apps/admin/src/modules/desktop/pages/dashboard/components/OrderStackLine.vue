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

const option = computed<EChartsOption>(() => ({
  grid: {
    left: 12,
    top: 50,
    right: 12,
    bottom: 12,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'time',
    axisLabel: {
      fontSize: 10,
      formatter: (value: number) => {
        const date = new Date(value)
        return `${date.getMonth() + 1}/${date.getDate()}`
      }
    }
  },
  yAxis: [
    {
      type: 'value',
      name: '订单成功率(%)',
      position: 'left',
      min: 90,
      max: 100,
      axisLabel: {
        fontSize: 10,
        formatter: '{value}%'
      },
      splitLine: { show: false }
    },
    {
      type: 'value',
      name: '失败订单数',
      position: 'right',
      axisLabel: {
        fontSize: 10
      },
      splitLine: { show: false }
    }
  ],
  series: [
    {
      type: 'line',
      yAxisIndex: 0,
      smooth: true,
      showSymbol: true,
      symbol: 'circle',
      symbolSize: 6,
      name: '订单成功率',
      color: '#059669',
      lineStyle: {
        width: 3,
        color: '#059669'
      },
      data: props.data.map((item) => [
        item.dataTime, 
        ((item.success / item.total) * 100).toFixed(2)
      ]),
    },
    {
      type: 'bar',
      yAxisIndex: 1,
      name: '失败订单',
      color: '#e11d48',
      barWidth: '60%',
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: '#e11d48' },
            { offset: 1, color: '#fda4af' }
          ]
        },
        borderRadius: [2, 2, 0, 0]
      },
      data: props.data.map((item) => [item.dataTime, item.failure]),
    }
  ]
}))
</script>

<template>
  <VChart
    :option="option"
    :theme="theme.name"
    :autoresize="{throttle: 200}"
  />
</template>
