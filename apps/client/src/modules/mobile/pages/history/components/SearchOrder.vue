<script setup lang="ts">
import BaseForm from './BaseForm.vue'
import { HISTORY_STORE, form, formatOrderParams } from '../utils'
import { orderApi } from '@/api/orders'

const store = inject(HISTORY_STORE)!

const submitLoading = ref(false)
const { t } = useI18n()

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
    :title="t('order.title.filter')" class="h-[78%]"
  >
    <BaseForm v-model="store.searchForm" class="px-4" />
    <div class="flex justify-end space-x-2 p-4">
      <XButton color="success" variant="soft" @click="handleReset">{{ t('order.button.mobile.reset') }}</XButton>
      <XButton :loading="submitLoading" @click="handleSubmit">{{ t('order.button.mobile.search') }}</XButton>
    </div>
  </TheModal>
</template>
