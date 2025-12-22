<script setup lang="ts">
import { twMerge, twJoin } from 'tailwind-merge'

import type { Order } from '@/api/orders'
import {
  ORDER_STATUS,
} from '@3un/utils'

interface OrderCardProps {
  order: Order
  isSubmit?: boolean
  class?: string
  index?: number
}

const props = defineProps<OrderCardProps>()
const { isSubmit } = props

const order = ref(props.order)

const appName = import.meta.env.VITE_APP_NAME

const serviceStore = useServiceStore()
const serviceName = computed(() => {
  const id = order.value.serviceId
  const service = serviceStore.services.get(id)
  return service ? service.title : '--'
})

const status = computed(() => ({
  isSuccess: order.value.status === ORDER_STATUS.SUCCESS,
  isFailed: order.value.status === ORDER_STATUS.FAILED,
  isProcessing: order.value.status === ORDER_STATUS.PROCESSING,
  isWait: order.value.status === ORDER_STATUS.WAIT,
}))

const cleanResult = computed(() => {
  return order.value.result.replace(/<img[^>]*>/,'') || ''
})
</script>

<template>
  <div
    :class="twMerge(
      'flex flex-col bg-card',
    )"
  >
    <div class="w-full text-center bg-zinc-100 dark:bg-zinc-800 p-2 text-lg">
      <span>公众号: </span>
      <span>{{ appName }}</span>
    </div>
    <div class="w-full flex flex-col py-2 pl-2">
      <div class="flex items-center justify-between space-x-3">
        <span
          v-if="isSubmit"
          :class="twJoin(
            'relative flex items-center justify-center',
            'min-w-8 h-8 px-2 text-white font-bold rounded-lg text-sm',
            'bg-gradient-to-br from-primary/80 to-primary/40',
            'shadow-lg shadow-primary/20 backdrop-blur-sm',
  
            'before:absolute before:top-0 bottom-0 left-0 right-0 before:rounded-lg',
            'before:border-2 before:border-primary/30 before:border-r-primary/60',
            'before:transform before:rotate-3 before:z-[-1]',
          )"
        >
          <span class="transform -rotate-3">{{ index }}</span>
        </span>
        <span v-else class="text-base font-medium">{{ order.id }}</span>
        <div class="flex">
          <XTag size="sm" color="success" label="成功" />
        </div>
      </div>
      
      <div class="w-full text-sm flex flex-col">
        <div class="flex-1 flex items-center">
          <span class="text-muted-foreground shrink-0">处理服务：</span>
          <span class="font-medium whitespace-nowrap">{{ serviceName }}</span>
        </div>
  
        <div class="flex items-center group">
          <div class="flex items-center">
            <span class="text-muted-foreground shrink-0">数据来源：</span>
            <span class="font-medium font-mono">{{ order.imei }}</span>
          </div>
        </div>
  
        <div v-if="order.createTime" class="flex items-center">
          <span class="text-muted-foreground shrink-0">提交时间：</span>
          <span class="font-medium whitespace-nowrap">{{ order.createTime }}</span>
        </div>
  
        <div class="flex items-center">
          <span class="text-muted-foreground shrink-0">消耗积分：</span>
          <span
            :class="twJoin(
              'font-medium text-danger',
              status.isFailed && 'line-through',
            )"
          >
            {{ order.credits }}
          </span>
          <span v-if="status.isFailed" class="text-xs">(已退回)</span>
        </div>
      </div>

      <div class="text-sm">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-muted-foreground">订单结果：</span>
        </div>
  
        <div
          :class="twMerge(
            'whitespace-nowrap p-3 bg-muted rounded overflow-x-auto w-full'
          )"
          v-html="cleanResult || '订单处理中...'"
        />
      </div>

      <div class="text-sm" v-if="order.recommends && order.recommends.length">
        <div class="text-muted-foreground mb-1.5">推荐解锁服务：</div>
        <ol class="bg-muted rounded p-3 list-decimal list-inside">
          <li v-for="recommend in order.recommends" :key="recommend.packageId">
            <a
              :href="`/m/submit/${recommend.packageId}`"
              class="underline active:text-success"
            >
              {{ recommend.packageId }} - {{ recommend.name }}
            </a>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>
