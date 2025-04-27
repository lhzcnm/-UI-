<script setup lang="ts">
import BaseForm from './BaseForm.vue'

import { HISTORY_STORE, formatOrderParams } from '../utils'
import { orderApi } from '@/api/orders'
import { downloadURL } from '@3un/utils'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)

function handleSubmit() {
  submitLoading.value = true

  const params = formatOrderParams(store.exportForm)
  const response = orderApi.export({
    serviceId: store.exportForm.serviceId,
    ...params,
  })

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
    :close-on-esc="false"
    :mask-closable="false"
    title="导出订单"
  >
    <BaseForm v-model="store.exportForm" />

    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <XButton variant="soft" @click="store.visibleExport = false">取消</XButton>
        <XButton :loading="submitLoading" @click="handleSubmit">导出</XButton>
      </div>
    </template>
  </XDialog>
</template>
