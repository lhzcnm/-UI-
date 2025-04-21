<script setup lang="ts">
import BaseForm from './BaseForm.vue'

import { HISTORY_STORE, formatOrderParams, form } from '../utils'
import { orderApi } from '@/api/orders'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)

function handleSubmit() {
  submitLoading.value = true

  const size = store.orders.pageSize
  const serviceId = store.searchForm.serviceId
  const params = formatOrderParams(store.searchForm)
  const response = orderApi.list({
    serviceId: serviceId || undefined,
    pageSize: size, page: 1,
    ...params,
  })

  response.then((res) => {
    store.orders = res.data
    store.visibleSearch = false
  })

  response.finally(() => {
    submitLoading.value = false
  })
}

function handleReset() {
  store.searchForm = { ...form.search }
  console.log(store.searchForm)
}
</script>

<template>
  <XDialog
    v-model="store.visibleSearch"
    :close-on-escape="false"
    :interact="false"
    title="搜索订单"
  >
    <BaseForm v-model="store.searchForm" />

    <template #footer>
      <div class="flex justify-between space-x-2 mt-4">
        <XButton
          :loading="submitLoading"
          label="重置" color="teal"
          @click="handleReset"
        />
        <div class="space-x-2">
          <XButton variant="soft" @click="store.visibleSearch = false">取消</XButton>
          <XButton :loading="submitLoading" @click="handleSubmit">搜索</XButton>
        </div>
      </div>
    </template>
  </XDialog>
</template>
