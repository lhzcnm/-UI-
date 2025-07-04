<script setup lang="ts">
import OrderForm from './OrderForm.vue'
import { updateOrder } from '@/api/orders'
import { ORDER_STORE } from '../utils'

const store = inject(ORDER_STORE)!
const loading = ref(false)

function handleSubmit() {
  loading.value = true

  const code = store.formUpdate.code
    .trim().split('\n').join('<br>')

  const playload = { ...store.formUpdate, code }

  updateOrder(playload)
    .then(() => {
      store.orders.list[store.index!] = {
        ...store.orders.list[store.index!],
        code: playload.code,
        codeStatusId: playload.codeStatusId,
        messageFromServer: playload.messageFromServer,
        orderIdFromServer: playload.orderIdFromServer,
      }

      store.visibleUpdate = false
    })
    .finally(() => loading.value = false)
}
</script>

<template>
  <XDialog v-model="store.visibleUpdate" draggable title="修改订单">
    <OrderForm v-model="store.formUpdate" />
    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visibleUpdate = false">取消</XButton>
        <XButton :loading="loading" @click="handleSubmit">提交</XButton>
      </div>
    </template>
  </XDialog>
</template>
