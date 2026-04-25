<script setup lang="ts">
import { uploadQuotationImage } from '@/api/quotation'
import UploadForm from './UploadForm.vue'

import { createFormData } from '@3un/utils'
import { toast } from 'vue-sonner'

import { type QuotationUpload, zQuotationUploadForm } from '@/inters/quotation'
import { validate, type ValidRule } from '@/utils'

const iStore = useSystemStore()

const form = ref<QuotationUpload>(zQuotationUploadForm.parse({}))

watch(
  () => iStore.showQuotation,
  (val) => {
    if (val) {
      form.value = zQuotationUploadForm.parse({})
      form.value.file = undefined
    }
  }
)

function getRules() {
  const { file, key } = form.value

  const isImage = file && file.type.startsWith('image/')

  const rules: ValidRule[] = [
    { rule: !!file, message: '请上传文件' },
    { rule: !!isImage, message: '只允许上传图片文件' },
    { rule: !!key, message: '请选择上传的报价单里类型' },
  ]

  return rules
}

async function handleUpload() {
  if (!validate(getRules())) return

  try {
    const formData = createFormData(form.value)
    await uploadQuotationImage(formData)
    toast.success('上传成功')
    iStore.showQuotation = false
  } catch {
    toast.warning('上传失败')
  }
}
</script>

<template>
  <XDialog
    v-model="iStore.showQuotation"
    draggable
    title="上传报价单"
    ui-root="sm:p-0 sm:max-w-md"
    ui-header="p-4 border-b"
  >
    <template #default>
      <UploadForm class="p-4 border-b" v-model="form" />
    </template>

    <template #footer>
      <div class="p-4 mt-2 flex justify-end gap-2">
        <XButton label="取消" variant="soft" @click="iStore.showQuotation = false" />
        <XButton label="上传" @click="handleUpload" />
      </div>
    </template>
  </XDialog>
</template>
