<script setup lang="ts">
import ServiceStackLine from './ServiceStackLine.vue'

import type { StatService } from '@/inters/dashboard'
import { formatNumberToThousands } from '@/utils/common'
import { getService } from '@/api/dashboard'

import { STORE } from '../utils'

const store = inject(STORE)!

const selected = ref('7')
const serviceId = ref(1046)
const services = ref<StatService[]>([])

const serviceStats = computed(() => {
  if (services.value.length === 0) {
    return {
      totalOrders: 0,
      successOrders: 0,
      failureOrders: 0,
      processingOrders: 0,
      awaitingOrders: 0,
      successRate: 0
    }
  }
  
  const totalOrders = services.value.reduce((sum, service) => sum + service.orderCount, 0)
  const successOrders = services.value.reduce((sum, service) => sum + service.successOrder, 0)
  const failureOrders = services.value.reduce((sum, service) => sum + service.failOrder, 0)
  const processingOrders = services.value.reduce((sum, service) => sum + service.processingOrder, 0)
  const awaitingOrders = services.value.reduce((sum, service) => sum + service.awaitOrder, 0)
  
  const successRate = totalOrders > 0 ? (successOrders / totalOrders) * 100 : 0
  
  return {
    totalOrders,
    successOrders,
    failureOrders,
    processingOrders,
    awaitingOrders,
    successRate: Number(successRate.toFixed(2))
  }
})

await getServiceStat(selected.value, serviceId.value)

async function getServiceStat(value: string, serviceId: number) {
  const startDay = store.tomorrow.subtract(Number(value), 'day')
  const endDay = store.tomorrow

  const data = await getService({
    startTime: startDay.format('YYYY-MM-DD'),
    endTime: endDay.format('YYYY-MM-DD'),
    serviceId,
  })

  console.log('service', data)
  services.value = data
}
</script>

<template>
  <section class="border p-4 rounded">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center space-x-2">
        <h3 class="text-xl font-bold whitespace-nowrap">服务统计</h3>
        <SelectService
          v-model="serviceId"
          ui-trigger="w-48"
          @selected="getServiceStat(selected, $event)"
        />
      </div>

      <div class="flex items-center space-x-2">
        <XSelect
          v-model="selected"
          ui-trigger="w-48"
          @selected="getServiceStat($event, serviceId)"
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
        <div class="text-sm mb-1">总订单数量</div>
        <div class="text-lg font-bold text-primary">
          {{ formatNumberToThousands(serviceStats.totalOrders) }}
        </div>
      </div>

      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">成功订单数量</div>
        <div class="text-lg font-bold text-success">
          {{ formatNumberToThousands(serviceStats.successOrders) }}
        </div>
      </div>

      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">失败订单数量</div>
        <div class="text-lg font-bold text-danger">
          {{ formatNumberToThousands(serviceStats.failureOrders) }}
        </div>
      </div>

      <div class="w-48 p-3 rounded border">
        <div class="text-sm mb-1">订单成功率</div>
        <div class="text-lg font-bold text-success">
          {{ serviceStats.successRate }}%
        </div>
      </div>
    </div>

    <div class="border rounded overflow-hidden">
      <ServiceStackLine :data="services" class="h-36" />
    </div>
  </section>
</template>
