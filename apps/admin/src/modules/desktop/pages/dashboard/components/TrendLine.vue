<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import VChart from 'vue-echarts'
import { THEME } from '@3un/utils'

interface TrendLineProps {
  data: Array<[string, number]>
}

const props = defineProps<TrendLineProps>()

const theme = inject(THEME)!

const option = ref<EChartsOption>({
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    containLabel: false
  },
  tooltip: {
    trigger: 'axis',
    show: false
  },
  xAxis: {
    type: 'time',
    show: false,
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
      data: props.data,
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
    }
  ]
})
</script>

<template>
  <VChart
    :option="option"
    :theme="theme.name"
  />
</template>
