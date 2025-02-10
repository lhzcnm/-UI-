<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { findAllIMEIAndSNs } from '@3un/utils'
import { toast } from 'vue-sonner'
import * as XLSX from 'xlsx'

interface ImportPlaneEmits {
  (e: 'submit', imeiList: string[], remark: string): void
}

const emits = defineEmits<ImportPlaneEmits>()

const validImeiList = ref<string[]>([])
const open   = ref(false)
const imei   = ref('')
const remark = ref('')

const handleChange = useDebounceFn(
  () => {
    const imeiList = findAllIMEIAndSNs(imei.value)
    validImeiList.value = [...new Set(imeiList)]
  },
  500
)

function handleSubmit() {
  if (validImeiList.value.length === 0) {
    toast.warning('IMEI/SN 不能为空')
    return
  }

  emits(
    'submit',
    validImeiList.value,
    remark.value
  )
  open.value = false
}

function handleClosed() {
  validImeiList.value = []
  remark.value = ''
  imei.value = ''
}

async function handleDrop(event: DragEvent) {
  const file = event.dataTransfer?.files[0]
  if (!file) return

  const extension = file.name.split('.').pop()?.toLowerCase()!

  try {
    if (['txt', 'csv'].includes(extension)) {
      const text = await file.text()
      imei.value = text
    } else if (['xlsx', 'xls'].includes(extension)) {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
      imei.value = data.flat().filter(Boolean).join('\n')
    }

    handleChange()
  } catch (error) {
    console.error('[File parse error]', error)
    toast.error('文件解析错误')
  }
}
</script>

<template>
  <XPopover v-model="open" @closed="handleClosed">
    <template #trigger>
      <XButton label="导入" variant="indigo" />
    </template>

    <div class="flex flex-col gap-3 w-80 p-4 bg-card border rounded-lg shadow">
      <XTextarea
        v-model="imei"
        rows="10"
        autofocus
        @input="handleChange"
        @drop.prevent="handleDrop"
        @dragover.prevent
        placeholder="每行一个 IMEI/SN&#13;&#10;&#13;&#10;可以拖动文件到此导入&#13;&#10;支持 txt、csv、xlsx、xls 等"
      />
      <XTextarea v-model="remark" placeholder="您的备注信息" />

      <div class="flex items-center justify-between gap-2">
        <div class="text-sm text-gray-500">
          有效数量
          <span class="text-primary">{{ validImeiList.length }}</span>
        </div>
        <div class="flex justify-end gap-2">
          <XButton label="取消" variant="secondary" @click="open = false" size="sm" />
          <XButton label="导入" @click="handleSubmit" size="sm" />
        </div>
      </div>
    </div>
  </XPopover>
</template>
