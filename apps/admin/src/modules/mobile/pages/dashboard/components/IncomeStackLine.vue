<script setup lang="ts">
import type { EChartsOption } from 'echarts'

import VChart from 'vue-echarts'
import { THEME } from '@3un/utils'

interface TheProps {
  data: Record<string, string>
}

const props = defineProps<TheProps>()
const theme = inject(THEME)!

const option = computed<EChartsOption>(() => ({
  grid: {
    left: 0,
    top: 12,
    right: 0,
    bottom: 0,
    containLabel: false
  },
  tooltip: {
    trigger: 'axis',
  },
  xAxis: {
    type: 'time',
    show: false,
  },
  yAxis: {
    type: 'value',
    show: false,
  },
  series: [
    {
      type: 'line',
      smooth: true,
      showSymbol: true,
      symbol: 'circle',
      symbolSize: 4,
      name: '充值金额',
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
            { offset: 0, color: 'rgba(5, 150, 105, .5)' },
            { offset: 1, color: 'rgba(5, 150, 105, .1)' }
          ]
        }
      },
      data: Object.entries(props.data)
        .map(([key, value]) => [key, Number(value)]),
    },
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
