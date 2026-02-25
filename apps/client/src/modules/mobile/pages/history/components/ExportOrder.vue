<script setup lang="ts">
import BaseForm from './BaseForm.vue'
import { HISTORY_STORE, form, formatOrderParams } from '../utils'
import { orderApi } from '@/api/orders'
import { downloadURL } from '@3un/utils'
import { toast } from 'vue-sonner'
import { serviceApi } from '@/api/services'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)
const headers = ref<string[]>([])

const { t, locale } = useI18n()

async function handleSubmit() {
  if (!store.exportForm.serviceId) {
    return toast.warning(t('prompt.serviceNull'))
  }

  submitLoading.value = true
  await getServiceHeader(store.exportForm.serviceId)
  const params = formatOrderParams({...store.exportForm})

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

function handleClose() {
  store.exportForm = { ...form.export }
}

async function getServiceHeader(id: number) {
  const { data } = await serviceApi.header(id)
  headers.value = data.map(item => (locale.value === 'zh' ? item.name : item.nameEn ? item.nameEn : item.name))
}
</script>

<template>
  <TheModal
    v-model="store.visibleExport"
    :title="t('order.title.export')" class="h-[78%]"
    @close="handleClose"
  >
    <BaseForm v-model="store.exportForm" class="px-4" />
    <div class="flex justify-end p-4">
      <XButton color="success" :loading="submitLoading" @click="handleSubmit">{{ t('order.button.mobile.export') }}</XButton>
    </div>
  </TheModal>
</template>
