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
  <TheModal v-model="store.visibleUpdate" title="修改订单">
    <OrderForm v-model="store.formUpdate" class="px-4" />

    <div class="flex justify-end space-x-2 p-4">
      <XButton variant="soft" @click="store.visibleUpdate = false">取消</XButton>
      <XButton :loading="loading" @click="handleSubmit">提交</XButton>
    </div>
  </TheModal>
</template>
