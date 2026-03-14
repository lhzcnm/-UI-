<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Icon } from '@iconify/vue'

import { type ProductImport } from '@/inters/product'

const form = defineModel<ProductImport>({ required: true })

const uploadRef = ref<HTMLInputElement | null>(null)

const filename = computed(() => {
  const file = form.value.file
  if (!file?.name) return '选择文件'

  const name = file.name

  const MAX = 18

  if (name.length <= MAX) return name

  const extIndex = name.lastIndexOf('.')
  if (extIndex === -1) {
    // 没扩展名，直接截断
    return name.slice(0, MAX - 3) + '...'
  }

  const ext = name.slice(extIndex)
  const base = name.slice(0, extIndex)

  const keep = MAX - ext.length - 3
  const head = Math.max(keep, 4)

  return `${base.slice(0, head)}...${ext}`
})

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement

  if (!target.files || target.files?.length === 0) return
  const file = target.files[0]

  const nameArr = file.name.split('.')
  const extension = nameArr[nameArr.length - 1]

  if (!['xlsx', 'xls'].includes(extension)) {
    return toast.warning('仅支持上传xlsx文件')
  }

  form.value.file = file
  uploadRef.value!.value = ''

  // uploadProduct(file)
  // const xlsxBuffer = await file.arrayBuffer()
  // const workbook = XLSX.read(xlsxBuffer)
  // const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
  // const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
  // console.log(data)
}

function openUpload() {
  uploadRef.value?.click()
}
</script>

<template>
  <form class="divide-y" @submit.prevent>
    <XFormField label="数据文件" desc="需要导入的文件" required>
      <button class="w-full flex items-center border border-border rounded-lg px-3 py-2 gap-2" @click="openUpload">
        <Icon icon="lucide:upload" />
        <span>{{ filename }}</span>
      </button>
    </XFormField>

    <XFormField label="SKU" desc="匹配文件的SKU字段" required>
      <XInput v-model="form.sku" placeholder="SKU" />
    </XFormField>

    <XFormField label="型号" desc="匹配文件的型号字段" required>
      <XInput v-model="form.description" placeholder="Description" />
    </XFormField>

    <XFormField label="等级" desc="匹配文件的设备成色字段" required>
      <XInput v-model="form.grade" placeholder="Grade" />
    </XFormField>

    <XFormField label="数量" desc="匹配文件的数量字段" required>
      <XInput v-model="form.quantity" placeholder="QTY" />
    </XFormField>

    <XFormField label="价格" desc="匹配文件的价格字段" required>
      <XInput v-model="form.offer" placeholder="Offer" />
    </XFormField>

    <input ref="uploadRef" accept=".xlsx,.xls" type="file" class="hidden" @change="handleFileChange">
  </form>
</template>
