<script setup lang="ts">
import { IMEI_TYPE } from '@3un/shared/enums'
import { getSubmitImei } from '@/utils'
import { toast } from 'vue-sonner'
import * as XLSX from 'xlsx'

interface ImportPlaneProps {
  selectedId: number
}

interface ImportPlaneEmits {
  (e: 'submit', imeiList: string[], remark: string): void
}

const props = defineProps<ImportPlaneProps>()
const emits = defineEmits<ImportPlaneEmits>()

const store = useServiceStore()

const open   = ref(false)
const imei   = ref('')
const remark = ref('')

const validImeiList = computed(() => {
  const service = store.services.get(props.selectedId)
  const imeiType = service?.imeiType || IMEI_TYPE.NONE

  return getSubmitImei(imei.value, imeiType)
})

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
  remark.value = ''
  imei.value = ''
}

async function handleDrop(event: DragEvent) {
  const file = event.dataTransfer!.files[0]
  await handleFile(file)
}

async function handleFile(file: File) {
  const extension = file.name.split('.').pop()!.toLowerCase()
  let text = ''

  try {
    if (['txt', 'csv'].includes(extension)) {
      text = await file.text()
    }
    else if (['xlsx', 'xls'].includes(extension)) {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
      text = data.flat().filter(Boolean).join('\n')
    }

    imei.value = text
  } catch (error) {
    console.error('[File parse error]', error)
    toast.error('文件解析错误')
  }
}
</script>

<template>
  <XPopover v-model="open" @closed="handleClosed">
    <template #trigger>
      <XButton label="导入" :disabled="!selectedId" />
    </template>

    <div class="space-y-3 w-80 p-4">
      <XTextarea
        v-model="imei"
        rows="10" autofocus
        @dragover.prevent
        @drop.prevent="handleDrop"
        placeholder="每行一个 IMEI/SN&#13;&#10;&#13;&#10;可以拖动文件到此导入&#13;&#10;支持 txt、csv、xlsx、xls 等"
      />
      <XTextarea v-model="remark" placeholder="您的备注信息" />

      <div class="flex items-center justify-between space-x-2">
        <a
          href="javascript:void(0)" title="查看正确的 IMEI/SN"
          class="text-sm text-muted-foreground hover:bg-muted rounded-md px-2 py-1 -ml-2"
          @click="imei = validImeiList.join('\n')"
        >
          <span class="mr-1">有效数量</span>
          <span class="text-primary">{{ validImeiList.length }}</span>
        </a>
        <div class="flex justify-end space-x-2">
          <XButton label="取消" variant="soft" @click="open = false" size="sm" />
          <XButton label="导入" @click="handleSubmit" size="sm" />
        </div>
      </div>
    </div>
  </XPopover>
</template>
