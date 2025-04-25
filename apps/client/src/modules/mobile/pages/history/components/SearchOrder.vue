<script setup lang="ts">
import BaseForm from './BaseForm.vue'
import { HISTORY_STORE, form, formatOrderParams } from '../utils'
import { orderApi } from '@/api/orders'

const store = inject(HISTORY_STORE)!

const submitLoading = ref(false)

function handleSubmit() {
  submitLoading.value = true

  const serviceId = store.searchForm.serviceId
  const params = formatOrderParams(store.searchForm)
  const response = orderApi.list({
    serviceId: serviceId || undefined,
    pageSize: 20, page: 1,
    ...params,
  })

  response.then(({ data }) => {
    store.visibleSearch = false
    store.orders = data
  })

  response.finally(() => {
    submitLoading.value = false
  })
}

function handleReset() {
  store.searchForm = { ...form.search }
}
</script>

<template>
  <TheModal
    v-model="store.visibleSearch"
    title="搜索订单" class="h-[78%]"
  >
    <BaseForm v-model="store.searchForm" class="px-4" />
    <div class="flex justify-end space-x-2 p-4">
      <XButton color="success" variant="soft" @click="handleReset">重置表单</XButton>
      <XButton :loading="submitLoading" @click="handleSubmit">搜索订单</XButton>
    </div>
  </TheModal>
</template>
