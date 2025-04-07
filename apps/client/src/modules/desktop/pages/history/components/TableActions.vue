<script setup lang="ts">
import { XButton } from '@3un/ui'
import { ORDER_STATUS, ORDER_VERTIFY } from '@3un/shared/enums'
import type { Order } from '@/api/orders'
import { orderApi } from '@/api/orders'
import { toast } from 'vue-sonner'
import { useClipboard, useThrottleFn } from '@vueuse/core'
import { stripHtml } from '@3un/utils'
import {  ref } from 'vue'
import { HISTORY_STORE } from '../utils'

const props = defineProps<{
  row: Order
}>()

const status = {
  isSuccess: props.row.status === ORDER_STATUS.SUCCESS,
  isFailed: props.row.status === ORDER_STATUS.FAILED,
  isProcessing: props.row.status === ORDER_STATUS.PROCESSING,
  isWait: props.row.status === ORDER_STATUS.WAIT
}

const verify = {
  isNormal: props.row.verify === ORDER_VERTIFY.NORMAL,
  isReplied: props.row.verify === ORDER_VERTIFY.REPLIED,
  isSolved: props.row.verify === ORDER_VERTIFY.SOLVED,
  isRefunded: props.row.verify === ORDER_VERTIFY.REFUNDED
}

const store = inject(HISTORY_STORE)!

const focreHide = ref(false)
const { copy, copied } = useClipboard({ legacy: true })

watch(copied, (value) => value && toast.success('复制成功'))

const handleRefresh = useThrottleFn(() => {
  orderApi.item(props.row.id).then(({ data }) => {
    toast.success('刷新成功')
    const index = store.orders.list.findIndex((item: any) => item.id === props.row.id)
    if (index !== -1) {
      store.orders.list[index] = {
        ...store.orders.list[index],
        result: data.result
      }
    }
  })
}, 500)

const handleVerify = () => {
  orderApi.verify(props.row.id).then(() => {
    toast.success('已提交验证')
    focreHide.value = true
    const index = store.orders.list.findIndex((item: any) => item.id === props.row.id)
    if (index !== -1) {
      store.orders.list[index] = {
        ...store.orders.list[index],
        verify: ORDER_VERTIFY.REPLIED
      }
    }
  })
}

const handleCopy = () => {
  const items = props.row.result.split('<br>')
  copy(items.map(stripHtml).join('\n'))
}
</script>

<template>
  <div class="space-x-1 pt-1">
 
    <XButton
      color="emerald"
      label="复制结果"
      size="sm"
      @click="handleCopy"
    />
 
    <XButton
      v-if="verify.isNormal && status.isSuccess && !focreHide"
      variant="outline"
      color="amber"
      label="开启验证"
      size="sm"
      @click="handleVerify"
    />
   
    <XButton
      v-if="status.isProcessing"
      label="刷新"
      size="sm"
      @click="handleRefresh"
    />
  </div>
</template>