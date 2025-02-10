<script setup lang="ts">
import BaseSearchForm from './BaseSearchForm.vue'
import { HISTORY_STORE, getSearchOrderParams } from '../utils'
import { downloadURL } from '@3un/utils'
import orderApi from '@/api/orders'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)

function handleSubmit() {
  submitLoading.value = true

  const params = getSearchOrderParams(store.exportForm)
  const response = orderApi.export(params)

  response.then((res) => {
    downloadURL(res.data)
    store.visibleExport = false
  })

  response.finally(() => {
    submitLoading.value = false
  })
}
</script>

<template>
  <XDialog
    v-model="store.visibleExport"
    :close-on-escape="false"
    :interact="false"
    title="导出订单"
  >
    <BaseSearchForm v-model="store.exportForm" />

    <template #footer>
      <div class="flex justify-end gap-2 mt-4">
        <XButton variant="secondary" @click="store.visibleExport = false">取消</XButton>
        <XButton color="blue" :loading="submitLoading" @click="handleSubmit">导出</XButton>
      </div>
    </template>
  </XDialog>
</template>
