<script setup lang="ts">
import BaseSearchForm from './BaseSearchForm.vue'
import { HISTORY_STORE, getSearchOrderParams } from '../utils'
import orderApi from '@/api/orders'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)

function handleSubmit() {
  submitLoading.value = true

  const params = getSearchOrderParams(store.searchForm)
  const response = orderApi.list({
    pageSize: store.orders.pageSize,
    page: 1,
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
</script>

<template>
  <XDialog
    v-model="store.visibleSearch"
    :close-on-escape="false"
    :interact="false"
    title="搜索订单"
  >
    <BaseSearchForm v-model="store.searchForm" />

    <template #footer>
      <div class="flex justify-end gap-2 mt-4">
        <XButton variant="secondary" @click="store.visibleSearch = false">取消</XButton>
        <XButton color="blue" :loading="submitLoading" @click="handleSubmit">搜索</XButton>
      </div>
    </template>
  </XDialog>
</template>
