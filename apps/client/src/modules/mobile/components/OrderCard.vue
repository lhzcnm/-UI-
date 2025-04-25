<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { toast } from 'vue-sonner'
import { twMerge, twJoin } from 'tailwind-merge'
import { useClipboard, useThrottleFn } from '@vueuse/core'

import type { Order } from '@/api/orders'
import { orderApi } from '@/api/orders'
import {
  ORDER_STATUS_MAP,
  ORDER_VERTIFY_MAP,
  ORDER_STATUS,
  ORDER_VERTIFY,
} from '@3un/shared/enums'
import { stripHtml } from '@3un/utils'

interface OrderCardProps {
  order: Order
  isSubmit?: boolean
  class?: string
  index?: number
}

const props = defineProps<OrderCardProps>()
const { isSubmit, class: className } = props

const order = toRef(props, 'order')
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

const verify = computed(() => ({
  isNormal: order.value.verify === ORDER_VERTIFY.NORMAL,
  isReplied: order.value.verify === ORDER_VERTIFY.REPLIED,
  isSolved: order.value.verify === ORDER_VERTIFY.SOLVED,
  isRefunded: order.value.verify === ORDER_VERTIFY.REFUNDED,
}))

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success('复制成功'))

const handleRefresh = useThrottleFn(() => {
  orderApi.item(order.value.id).then((res) => {
    toast.success('刷新成功')
    order.value = res.data
  })
}, 500)

function handleVerify() {
  const { id, createTime } = order.value
  const createUnix = new Date(createTime).getTime()
  const diff = Date.now() - createUnix
  const daysDiff = diff / (24 * 3600 * 1000)

  if (daysDiff > 3) {
    toast.info('订单超过 3 天，不支持验证结果')
    return
  }

  window.confirm('确定开启验证吗？') && (() => {
    orderApi.verify(id).then(() => {
      order.value.verify = ORDER_VERTIFY.REPLIED
      toast.success('已提交验证')
    })
  })()
}

function handleCopy() {
  const items = order.value.result.split('<br>')
  copy(items.map(stripHtml).join('\n'))
}
</script>

<template>
  <div
    :class="twMerge(
      'bg-card rounded-lg p-4 space-y-4 shadow-sm',
      className,
    )"
  >
    <div class="flex items-center justify-between space-x-3">
      <span
        v-if="isSubmit"
        :class="twJoin(
          'relative flex items-center justify-center',
          'min-w-[32px] h-[32px] px-2',
          'bg-gradient-to-br from-primary/80 to-primary/40',
          'text-white font-bold',
          'rounded-lg text-sm',
          'before:absolute before:top-0 bottom-0 left-0 right-0 before:rounded-lg',
          'before:border-2 before:border-primary/30 before:border-r-primary/60',
          'before:transform before:rotate-3 before:z-[-1]',
          'shadow-lg shadow-primary/20 backdrop-blur-sm',
        )"
      >
        <span class="transform -rotate-3">{{ index }}</span>
      </span>
      <span v-else class="text-base font-medium">{{ order.id }}</span>
      <div class="flex space-x-2">
        <XTag v-bind="ORDER_STATUS_MAP[order.status]" />
        <XTag v-if="!isSubmit" v-bind="ORDER_VERTIFY_MAP[order.verify]" />
      </div>
    </div>

    <div class="text-sm">
      <div class="flex items-start">
        <span class="text-muted-foreground shrink-0">处理服务：</span>
        <span class="font-medium break-all">{{ serviceName }}</span>
      </div>

      <div class="flex items-center group">
        <div class="flex items-center">
          <span class="text-muted-foreground shrink-0">数据来源：</span>
          <span class="font-medium font-mono">{{ order.imei }}</span>
        </div>
        <button
          :class="twJoin(
            'p-1.5 text-muted-foreground',
            'opacity-0 group-hover:opacity-100 transition-opacity',
          )"
          @click="copy(order.imei)"
        >
          <Icon icon="lucide:clipboard-copy" class="size-4" />
        </button>
      </div>

      <div v-if="order.createTime" class="flex items-center">
        <span class="text-muted-foreground shrink-0">提交时间：</span>
        <span class="font-medium">{{ order.createTime }}</span>
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
        <div class="flex items-center space-x-3">
          <button
            v-if="!isSubmit && status.isProcessing"
            class="inline-flex items-center space-x-0.5 text-muted-foreground"
            @click="handleRefresh"
          >
            <Icon icon="lucide:refresh-cw" class="size-4" />
            <span class="text-xs">刷新</span>
          </button>

          <button
            v-if="verify.isNormal && status.isSuccess"
            class="inline-flex items-center space-x-0.5 text-muted-foreground"
            @click="handleVerify"
          >
            <Icon icon="lucide:info" class="size-4" />
            <span class="text-xs">开启验证</span>
          </button>

          <button
            v-if="status.isSuccess"
            class="inline-flex items-center space-x-0.5 text-muted-foreground"
            @click="handleCopy"
          >
            <Icon icon="lucide:clipboard-copy" class="size-4" />
            <span class="text-xs">复制</span>
          </button>
        </div>
      </div>

      <div
        class="bg-muted rounded p-3 whitespace-pre-line overflow-x-auto"
        v-html="order.result"
      />
    </div>

    <div class="text-sm" v-if="order.remark">
      <div class="text-muted-foreground mb-1.5">订单备注：</div>
      <div class="bg-muted rounded p-3">
        {{ order.remark }}
      </div>
    </div>
  </div>
</template>
