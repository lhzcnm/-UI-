<script setup lang="ts">
import BaseForm from './BaseForm.vue'

import { HISTORY_STORE, formatOrderParams } from '../utils'
import { orderApi } from '@/api/orders'
import { downloadURL } from '@3un/utils'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)

const { t } = useI18n()

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
    :title="t('order.title.export')"
  >
    <BaseForm v-model="store.exportForm" />

    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <ButtonGroup
          :layouts="['cancel', 'confirm']"
          @cancel="store.visibleExport = false" @confirm="handleSubmit"
        />
      </div>
    </template>
  </XDialog>
</template>
