<script setup lang="ts">
import { XButton } from '@3un/ui'

import { ORDER_STATUS, ORDER_VERTIFY } from '@3un/utils'
import { stripHtml } from '@3un/utils'
import { ref } from 'vue'
import { useClipboard, useThrottleFn } from '@vueuse/core'
import { toast } from 'vue-sonner'

import type { Order } from '@/api/orders'
import { orderApi } from '@/api/orders'
import { HISTORY_STORE } from '../utils'

interface TableActionProps {
  index: number
  row: Order
}

const { row, index } = defineProps<TableActionProps>()

const status = {
  isSuccess: row.status === ORDER_STATUS.SUCCESS,
  isFailed: row.status === ORDER_STATUS.FAILED,
  isProcessing: row.status === ORDER_STATUS.PROCESSING,
  isWait: row.status === ORDER_STATUS.WAIT
}

const verify = {
  isNormal: row.verify === ORDER_VERTIFY.NORMAL,
  isReplied: row.verify === ORDER_VERTIFY.REPLIED,
  isSolved: row.verify === ORDER_VERTIFY.SOLVED,
  isRefunded: row.verify === ORDER_VERTIFY.REFUNDED
}

const store = inject(HISTORY_STORE)!
const focreHide = ref(false)

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success('复制成功'))

const handleRefresh = useThrottleFn(() => {
  orderApi.item(row.id).then(({ data }) => {
    toast.success('刷新成功')

    if (data.status === ORDER_STATUS.SUCCESS) {
      focreHide.value = true
    }

    store.orders.list[index] = {
      ...store.orders.list[index],
      ...data
    }
  })
}, 500)

function handleVerify() {
  const { id, createTime } = row
  const createUnix = new Date(createTime).getTime()
  const diff = Date.now() - createUnix
  const daysDiff = diff / (24 * 3600 * 1000)

  if (daysDiff > 3) {
    toast.info('订单超过 3 天，不支持验证结果')
    return
  }

  orderApi.verify(id).then(() => {
    toast.success('已提交验证')

    focreHide.value = true
    store.orders.list[index] = {
      ...store.orders.list[index],
      verify: ORDER_VERTIFY.REPLIED
    }
  })
}

function handleCopy() {
  const items = row.result.split('<br>')
  copy(items.map(stripHtml).join('\n'))
}
</script>

<template>
  <div class="space-x-1 pt-1">
    <XButton
      color="success" label="复制结果"
      size="sm" @click="handleCopy"
    />
 
    <XButton
      v-if="verify.isNormal && status.isSuccess && !focreHide"
      variant="outline" color="warning"
      label="开启验证" size="sm"
      @click="handleVerify"
    />

    <XButton
      v-if="status.isProcessing && !focreHide"
      label="刷新" size="sm"
      @click="handleRefresh"
    />
  </div>
</template>
