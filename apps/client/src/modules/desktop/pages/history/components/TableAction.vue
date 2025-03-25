<script setup lang="ts">
import type { ICellRendererParams } from 'ag-grid-community'
import type { Order } from '@/api/orders'

import { toast } from 'vue-sonner'
import { useClipboard, useThrottleFn } from '@vueuse/core'
import { ORDER_STATUS, ORDER_VERTIFY } from '@3un/shared/enums'
import { stripHtml } from '@3un/utils'
import { orderApi } from '@/api/orders'

interface TableActionProps {
  params: ICellRendererParams & Order
}

const { params } = defineProps<TableActionProps>()

const status = {
  isSuccess: params.status === ORDER_STATUS.SUCCESS,
  isFailed: params.status === ORDER_STATUS.FAILED,
  isProcessing: params.status === ORDER_STATUS.PROCESSING,
  isWait: params.status === ORDER_STATUS.WAIT,
}

const verify = {
  isNormal: params.verify === ORDER_VERTIFY.NORMAL,
  isReplied: params.verify === ORDER_VERTIFY.REPLIED,
  isSolved: params.verify === ORDER_VERTIFY.SOLVED,
  isRefunded: params.verify === ORDER_VERTIFY.REFUNDED,
}

const focreHide = ref(false)

const { copy, copied } = useClipboard({ legacy: true })
watch(copied, (value) => value && toast.success('复制成功'))

const handleRefresh = useThrottleFn(() => {
  orderApi.item(params.id).then(({ data }) => {
    toast.success('刷新成功')
    const node = params.node
    node.updateData({
      ...params.data,
      result: data.result,
    })
  })
}, 500)

function handleVerify() {
  orderApi.verify(params.id).then(() => {
    toast.success('已提交验证')
    focreHide.value = true

    const node = params.node
    node.updateData({
      ...params.data,
      verify: ORDER_VERTIFY.REPLIED,
    })
  })
}

function handleCopy() {
  const items = params.result.split('<br>')
  copy(items.map(stripHtml).join('\n'))
}
</script>

<template>
  <div class="space-x-1 pt-1">
    <XButton
      color="emerald"
      label="复制结果" size="sm"
      @click="handleCopy"
    />
    <XButton
      v-if="verify.isNormal && status.isSuccess && !focreHide"
      variant="outline" color="amber"
      label="开启验证" size="sm"
      @click="handleVerify"
    />
    <XButton
      v-if="status.isProcessing"
      label="刷新" size="sm"
      @click="handleRefresh"
    />
  </div>
</template>
