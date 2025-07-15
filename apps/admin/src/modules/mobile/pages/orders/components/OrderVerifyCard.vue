<script setup lang="ts">
import { ORDER_STATUS, ORDER_STATUS_MAP, ORDER_VERIFY, SUBMIT_METHOD_MAP } from '@3un/utils'
import { toast } from 'vue-sonner'

import type { Order } from '@/inters/orders'
import { updateOrderVerify } from '@/api/orders'

import { VERIFY_STORE } from '../utils'

interface TheProps {
  order: Order
  index: number
}

const props = defineProps<TheProps>()
const { order } = props

const serviceStore = useServiceStore()
const store = inject(VERIFY_STORE)!

const serviceName = computed(() => {
  const service = serviceStore.itemMap.get(order.packageId)
  return service ? service.packageTitle : '--'
})

const result = order.code
  .trim().replace(/<br>/g, '\n')

const speed = getSpeed()

function getSpeed() {
  const whiteList = [ORDER_STATUS.PROCESSING, ORDER_STATUS.WAIT]
  if (whiteList.includes(order.codeStatusId)) {
    return null
  }

  const updateTimeDate = new Date(order.updateTime).getTime()
  const requestedAtDate = new Date(order.requestedAt).getTime()
  const diffTime = updateTimeDate - requestedAtDate
  const diff = Math.round(diffTime / 1000)
  return diff < 1 ? '<1s' : `${diff}s`
}

function handleAction(verify: number) {
  if (!order.code) return toast.warning('请先回复订单')
  const response = updateOrderVerify([{
    verify,
    codeId: order.codeId,
    userId: order.userId,
    codeStatusId: verify,
    originalStatus: order.codeStatusId,
    code: order.code.trim().split('\n').join('<br>'),
  }])

  response.then(() => {
    store.orders.list.splice(props.index, 1)
    store.orders.total--
    toast.success('操作成功')
  })
}
</script>

<template>
  <div class="p-3 bg-card border rounded-lg">
    <div class="flex items-center justify-between">
      <span class="text-base font-medium">{{ order.codeId }}</span>
      <div class="flex items-center space-x-2">
        <XButton
          label="退积分" variant="outline"
          size="sm" color="danger"
          @click="handleAction(ORDER_VERIFY.REFUNDED)"
        />
        <XButton
          label="回复"
          size="sm" color="success" 
          icon="lucide:message-circle-reply"
          @click="handleAction(ORDER_VERIFY.SOLVED)"
        />
      </div>
    </div>

    <div class="flex space-x-1 mt-2">
      <XTag color="primary" :label="order.packageId.toString()" size="sm" />
      <XTag v-bind="SUBMIT_METHOD_MAP[order.submitMethod]" size="sm" />
      <XTag v-bind="ORDER_STATUS_MAP[order.codeStatusId]" size="sm" />
      <XTag v-if="speed" color="primary" :label="speed" size="sm" />
    </div>

    <div class="mt-2 text-sm">
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">上游订单号：</span>
        <span class="font-medium break-all">{{ order.orderIdFromServer }}</span>
      </div>
      <div class="flex items-start">
        <span class="text-muted-foreground shrink-0">处理服务：</span>
        <span class="font-medium break-all">{{ serviceName }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">数据来源：</span>
        <span class="font-medium break-all">{{ order.imeiNo }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">请求日期：</span>
        <span class="font-medium break-all">{{ order.requestedAt.slice(5) }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">更新日期：</span>
        <span class="font-medium break-all">{{ order.updateTime.slice(5) }}</span>
      </div>
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">所属用户：</span>
        <a
          :href="`/users?uid=${order.userId}`"
          class="font-medium break-all underline"
        >
          {{ order.userId }}
        </a>
      </div>
      <div class="flex items-center">
        <span class="text-muted-foreground shrink-0">订单积分：</span>
        <span class="font-medium break-all">{{ order.credits }}</span>
      </div>
    </div>

    <div class="mt-2 text-sm">
      <div class="text-muted-foreground mb-1">订单结果</div>
      <XTextarea v-model="result" class="whitespace-nowrap" rows="6" />
    </div>

    <div class="mt-2 text-sm" v-if="order.comments">
      <div class="text-muted-foreground mb-1">订单备注</div>
      <div class="bg-muted rounded p-3">
        {{ order.comments }}
      </div>
    </div>
  </div>
</template>
