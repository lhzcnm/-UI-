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

const { locale } = useI18n()
const localStore = useLocalStore()

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
    return toast.warning(localStore.localData['history_Service_Select'])
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
  <TheModal v-model="store.visibleExport" :title="localStore.localData['history_ExportOrder']" class="h-[78%]" @close="handleClose">



    <BaseForm v-model="store.exportForm" class="px-4" />
    <div class="flex justify-end p-4">
      <XButton color="success" :loading="submitLoading" @click="openFileDialog">{{ localStore.localData['history_ExportOrder']
      }}
      </XButton>
    </div>

    <XDialog v-model="exportDialog" :maskClosable="false" ui-root="p-0 sm:p-0 sm:max-w-[450px]"
      :title="localStore.localData['history_SelectFileTypes']" draggable>

      <template #header>
        <div class="p-2 border-b">
          <div class="w-full text-center">{{ localStore.localData['history_ExportName'] }}</div>
          <div @click="exportDialog = false" class="fixed top-1 right-4">x</div>
        </div>
      </template>

      <section class="flex flex-col justify-center items-center space-y-2 mx-auto px-6 py-2">

        <XInput v-model="fileName" class="w-2/3" :placeholder="localStore.localData['history_ExportFileName']" />
        <div class="text-sm text-center text-muted-foreground mb-2">{{ localStore.localData['history_CustomFileName'] }}</div>

      </section>


      <div class="p-2 border-t">
        <XButton class="w-full" variant="soft" :loading="submitLoading" @click="handleSubmit">{{
          localStore.localData['history_ExportOrder'] }}
        </XButton>
      </div>
    </XDialog>

  </TheModal>
</template>
