<script setup lang="ts">
import { ORDER_VERIFY } from '@3un/utils'
import { toast } from 'vue-sonner'

import type { Order } from '@/inters/orders'
import { updateOrderVerify } from '@/api/orders'
import { VERIFY_STORE } from '../utils'

interface OrderVerifyActionProps {
  index: number
  row: Order
}

const { index, row } = defineProps<OrderVerifyActionProps>()
const store = inject(VERIFY_STORE)!

function handleAction(verify: number) {
  if (!row.code) return toast.warning('请先回复订单')
  const response = updateOrderVerify([{
    verify,
    codeId: row.codeId,
    userId: row.userId,
    codeStatusId: verify,
    originalStatus: row.codeStatusId,
    code: row.code.trim().split('\n').join('<br>'),
  }])

  response.then(() => {
    store.orders.list.splice(index, 1)
    store.orders.total--
    toast.success('操作成功')
  })
}
</script>

<template>
  <div class="flex space-x-2">
    <XButton
      label="回复"
      size="sm"
      color="primary"
      icon="lucide:message-circle-reply"
      @click="handleAction(ORDER_VERIFY.SOLVED)"
    />
    <XButton
      label="退积分"
      size="sm" color="danger" icon="lucide:x"
      @click="handleAction(ORDER_VERIFY.REFUNDED)"
    />
  </div>
</template>
