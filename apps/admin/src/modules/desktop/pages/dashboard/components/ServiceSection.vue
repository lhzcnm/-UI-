<script setup lang="ts">
import ServiceStackLine from './ServiceStackLine.vue'

import type { OrderStatItem } from '@/inters/dashboard'
import { formatNumberToThousands } from '@/utils/common'
import { getServiceRange } from '@/api/dashboard'

import { STORE } from '../utils'

const store = inject(STORE)!

const services  = ref<OrderStatItem[]>([])
const selected  = ref('7')
const serviceId = ref(1046)

const serviceStats = computed(() => {
  if (services.value.length === 0) {
    return { total: 0, success: 0, failure: 0, successRate: 0 }
  }
  
  const total = services.value.reduce((sum, service) => sum + service.total, 0)
  const success = services.value.reduce((sum, service) => sum + service.success, 0)
  const failure = services.value.reduce((sum, service) => sum + service.failure, 0)
  const successRate = total > 0 ? (success / total) * 100 : 0
  
  return { total, success, failure, successRate: Number(successRate.toFixed(2)) }
})

await getStatData(selected.value, serviceId.value)

async function getStatData(value: string, serviceId: number) {
  const startDay = store.tomorrow.subtract(Number(value), 'day')
  const endDay = store.tomorrow

  const data = await getServiceRange({
    startTime: startDay.format('YYYY-MM-DD'),
    endTime: endDay.format('YYYY-MM-DD'),
    serviceId,
  })

  console.log('service', data)
  services.value = data
}
</script>

<template>
  <section class="border rounded">
    <div class="flex items-center justify-between p-3 border-b">
      <h3 class="text-lg font-bold whitespace-nowrap">服务统计</h3>

      <div class="flex items-center space-x-2">
        <SelectService
          v-model="serviceId"
          ui-trigger="w-48" placement="top"
          @selected="getStatData(selected, $event)"
        />

        <XSelect
          v-model="selected" ui-trigger="w-48"
          @selected="getStatData($event, serviceId)"
        >
          <XSelectItem value="7">最近7天</XSelectItem>
          <XSelectItem value="30">最近一个月</XSelectItem>
          <XSelectItem value="90">最近三个月</XSelectItem>
          <XSelectItem value="180">最近半年</XSelectItem>
          <XSelectItem value="365">最近一年</XSelectItem>
        </XSelect>
      </div>
    </div>

    <div class="flex flex-col h-64 overflow-hidden">
      <div class="flex divide-x border-b border-dashed">
        <div class="px-4 py-2">
          <div class="text-sm mb-1">总订单数量</div>
          <div class="text-lg font-bold text-primary">
            {{ formatNumberToThousands(serviceStats.total) }}
          </div>
        </div>
  
        <div class="px-4 py-2">
          <div class="text-sm mb-1">成功订单数量</div>
          <div class="text-lg font-bold text-success">
            {{ formatNumberToThousands(serviceStats.success) }}
          </div>
        </div>
  
        <div class="px-4 py-2">
          <div class="text-sm mb-1">失败订单数量</div>
          <div class="text-lg font-bold text-danger">
            {{ formatNumberToThousands(serviceStats.failure) }}
          </div>
        </div>
  
        <div class="px-4 py-2">
          <div class="text-sm mb-1">订单成功率</div>
          <div class="text-lg font-bold text-success">
            {{ serviceStats.successRate }}%
          </div>
        </div>
      </div>
  
      <ServiceStackLine :data="services" class="flex-1" />
    </div>
  </section>
</template>
