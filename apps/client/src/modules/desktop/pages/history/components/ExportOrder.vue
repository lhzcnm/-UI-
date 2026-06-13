<script setup lang="ts">
import BaseForm from './BaseForm.vue'

import { HISTORY_STORE, formatOrderParams } from '../utils'
import { orderApi } from '@/api/orders'
import { downloadURL } from '@3un/utils'
import { serviceApi } from '@/api/services'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)
const headers = ref<string[]>([])

const { locale } = useI18n()
const localStore = useLocalStore()

async function handleSubmit() {
  await getServiceHeader(store.exportForm.serviceId)
  submitLoading.value = true

  const params = formatOrderParams({ ...store.exportForm })

  try {
    const { data } = await orderApi.export({
      serviceId: store.exportForm.serviceId,
      ...params,
      excelHead: headers.value,
    })
    downloadURL(data)
    store.visibleExport = false
  } finally {
    submitLoading.value = false
  }
}

async function getServiceHeader(id: number) {
  const { data } = await serviceApi.header(id)

  headers.value = data.map(item => (locale.value === 'zh' ? item.name : item.nameEn ? item.nameEn : item.name))
}
</script>

<template>
  <XDialog v-model="store.visibleExport" :close-on-esc="false" :mask-closable="false"
    :title="localStore.localData['history_ExportOrder']">
    <BaseForm v-model="store.exportForm" />

    <template #footer>
      <div class="flex justify-end space-x-2 mt-4">
        <ButtonGroup :layouts="['cancel', 'confirm']" :labels="{
          cancel: localStore.localData['history_CancelExport'],
          confirm: localStore.localData['history_ConfirmExport']
        }" @cancel="store.visibleExport = false" @confirm="handleSubmit" />
      </div>
    </template>
  </XDialog>
</template>
