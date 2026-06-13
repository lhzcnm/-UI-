<script setup lang="ts">
import BaseForm from './BaseForm.vue'

import { HISTORY_STORE, formatOrderParams, form } from '../utils'
import { orderApi } from '@/api/orders'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)

const localStore = useLocalStore()

function handleSubmit() {
  if(submitLoading.value) return

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
}
</script>

<template>
  <XDialog
    v-model="store.visibleSearch"
    :close-on-esc="false"
    :mask-closable="false"
    :title="localStore.localData['history_FilterOrders']"
  >
    <BaseForm v-model="store.searchForm" />

    <template #footer>
      <div class="flex justify-between space-x-2 mt-4">
        <XButton
          :loading="submitLoading"
          :label="localStore.localData['history_Reset']" color="success"
          @click="handleReset"
        />
        <div class="space-x-2">
          <ButtonGroup
            :layouts="['cancel', 'confirm']":labels="{
              cancel: localStore.localData['history_CancelSearch'],
              confirm: localStore.localData['history_ConfirmSearch']
            }"
            @cancel="store.visibleSearch = false" @confirm="handleSubmit"
          />
        </div>
      </div>
    </template>
  </XDialog>
</template>
