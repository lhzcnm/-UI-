<script setup lang="ts">
import OrderForm from '@forms/orders/OrderForm.vue'
import { ORDER_STORE } from '../utils'

const store = inject(ORDER_STORE)!

function handleSubmit() {
  store.visibleUpdate = false
}
</script>

<template>
  <XDialog v-model="store.visibleUpdate" title="修改订单">
    <OrderForm v-model="store.formUpdate" />
    <template #footer>
      <XButton variant="soft" size="sm" @click="store.visibleUpdate = false">取消</XButton>
      <XButton size="sm" @click="handleSubmit">提交</XButton>
    </template>
  </XDialog>
</template>
