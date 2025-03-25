<script setup lang="ts">
import BaseForm from './BaseForm.vue'
import { HISTORY_STORE, form, formatOrderParams } from '../utils'
import { orderApi } from '@/api/orders'
import { downloadURL } from '@3un/utils'
import { toast } from 'vue-sonner'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)

function handleSubmit() {
  if (!store.exportForm.serviceId) {
    return toast.warning('需要选择服务')
  }

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

function handleClose() {
  store.exportForm = { ...form.export }
}
</script>

<template>
  <TheModal
    v-model="store.visibleExport"
    title="导出订单" class="h-[78%]"
    @close="handleClose"
  >
    <BaseForm v-model="store.exportForm" class="px-4" />
    <div class="flex justify-end p-4">
      <XButton color="emerald" :loading="submitLoading" @click="handleSubmit">导出订单</XButton>
    </div>
  </TheModal>
</template>
