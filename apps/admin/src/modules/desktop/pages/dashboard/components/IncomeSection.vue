<script setup lang="ts">
import IncomeStackLine from './IncomeStackLine.vue'
import { getIncome } from '@/api/dashboard'
import { STORE } from '../utils'
import { formatNumberToThousands } from '@/utils/common'

import { Dayjs } from 'dayjs'

const store = inject(STORE)!

const income = ref<Record<string, string>>({})
const selected = ref('7')

const stats = computed(() => {
  // 将字符串转换为数字，过滤掉无效值和 0 值
  const values = Object.values(income.value)
    .map(v => parseFloat(v))
    .filter(v => !isNaN(v) && v > 0)
  
  if (values.length === 0) {
    return {
      max: 0,
      min: 0,
      avg: 0,
      total: 0,
      count: 0
    }
  }
  
  const max = Math.max(...values)
  const min = Math.min(...values)
  const total = values.reduce((sum, val) => sum + val, 0)
  const avg = total / values.length
  
  return {
    max: Number(max.toFixed(2)),
    min: Number(min.toFixed(2)),
    avg: Number(avg.toFixed(2)),
    total: Number(total.toFixed(2)),
    count: values.length
  }
})

await getIncomeStat(selected.value)

async function getIncomeStat(value: string) {
  const startDay = store.tomorrow.subtract(Number(value), 'day')
  const endDay = store.tomorrow

  const data = await getIncome({
    startTime: startDay.format('YYYY-MM-DD'),
    endTime: endDay.format('YYYY-MM-DD'),
  })

  const patchedData = patchData(startDay, endDay, data)
  console.log('income', patchedData)

  income.value = patchedData
}

function patchData(
  startDay: Dayjs,
  endDay: Dayjs,
  data: Record<string, string>
) {
  const diff = endDay.diff(startDay, 'day')
  const result: Record<string, string> = {}

  for (let i = 0; i < diff; i++) {
    const day = startDay.add(i, 'day').format('YYYY-MM-DD')

    if (day in data) result[day] = data[day]
    else result[day] = '0'
  }

  return result
}
</script>

<template>
  <section class="border p-4 rounded">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold">充值统计</h3>

      <div class="flex items-center space-x-2">
        <XSelect
          v-model="selected"
          ui-trigger="w-48"
          @selected="getIncomeStat"
        >
          <XSelectItem value="7">最近7天</XSelectItem>
          <XSelectItem value="30">最近一个月</XSelectItem>
          <XSelectItem value="90">最近三个月</XSelectItem>
          <XSelectItem value="180">最近半年</XSelectItem>
          <XSelectItem value="365">最近一年</XSelectItem>
        </XSelect>
      </div>
    </div>

    <div class="flex space-x-4 mb-4">
      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">总充值金额</div>
        <div class="text-lg font-bold text-primary">
          ¥ {{ formatNumberToThousands(stats.total) }}
        </div>
      </div>

      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">最大充值金额</div>
        <div class="text-lg font-bold text-success">
          ¥ {{ formatNumberToThousands(stats.max) }}
        </div>
      </div>

      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">最小充值金额</div>
        <div class="text-lg font-bold text-warning">
          ¥ {{ formatNumberToThousands(stats.min) }}
        </div>
      </div>

      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">平均充值金额</div>
        <div class="text-lg font-bold text-danger">
          ¥ {{ formatNumberToThousands(stats.avg) }}
        </div>
      </div>
    </div>

    <div class="border rounded overflow-hidden">
      <IncomeStackLine :data="income" class="h-36" />
    </div>
  </section>
</template>
