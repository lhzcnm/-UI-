<script setup lang="ts">
import BaseForm from './BaseForm.vue'
import { HISTORY_STORE, form, formatOrderParams } from '../utils'
import { orderApi } from '@/api/orders'
import { downloadURL } from '@3un/utils'
// import { toast } from 'vue-sonner'
import { serviceApi } from '@/api/services'
import { toast } from 'vue-sonner'

const store = inject(HISTORY_STORE)!
const submitLoading = ref(false)
const headers = ref<string[]>([])
const fileName = ref<string | undefined>()

const exportDialog = ref<boolean>(false)

const { t, locale } = useI18n()

async function handleSubmit() {
  submitLoading.value = true
  await getServiceHeader(store.exportForm.serviceId)
  const params = formatOrderParams({ ...store.exportForm })

  try {
    const { data } = await orderApi.export({
      serviceId: store.exportForm.serviceId,
      ...params,
      excelHead: headers.value,
      fileName: fileName.value
    })
    downloadURL(data)
    store.visibleExport = false
  } finally {
    submitLoading.value = false
    exportDialog.value = false
    fileName.value = undefined
  }
}

function openFileDialog() {
  if (!store.exportForm.serviceId) {
    return toast.warning(t('prompt.serviceNull'))
  }

  exportDialog.value = true

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
  <TheModal v-model="store.visibleExport" :title="t('order.title.export')" class="h-[78%]" @close="handleClose">



    <BaseForm v-model="store.exportForm" class="px-4" />
    <div class="flex justify-end p-4">
      <XButton color="success" :loading="submitLoading" @click="openFileDialog">{{ t('order.button.mobile.export')
      }}
      </XButton>
    </div>

    <XDialog v-model="exportDialog" :maskClosable="false" ui-root="p-0 sm:p-0 sm:max-w-[450px]"
      :title="t('query.fileImportDataSelection')" draggable>

      <template #header>
        <div class="p-2 border-b">
          <div class="w-full text-center">{{ t('order.exportFileName') }}</div>
          <div @click="exportDialog = false" class="fixed top-1 right-4">x</div>
        </div>
      </template>

      <section class="flex flex-col justify-center items-center space-y-2 mx-auto px-6 py-2">

        <XInput v-model="fileName" class="w-2/3" :placeholder="t('order.enterExportFileName')" />
        <div class="text-sm text-center text-muted-foreground mb-2">{{ t('order.customFileNameHint') }}</div>

      </section>


      <div class="p-2 border-t">
        <XButton class="w-full" variant="soft" :loading="submitLoading" @click="handleSubmit">{{
          t('order.button.mobile.export') }}
        </XButton>
      </div>
    </XDialog>

  </TheModal>
</template>
