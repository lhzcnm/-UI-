<script setup lang="ts">
import { IMEI_TYPE } from '@3un/utils'
import { getSubmitImei } from '@/utils'
import { toast } from 'vue-sonner'
import * as XLSX from 'xlsx'

interface ImportPlaneProps {
  selectedId: number | undefined
  disabled?: boolean
}

interface ImportPlaneEmits {
  (e: 'submit', imeiList: string[], remark: string): void
}

const uStore = useUserStore()
const serviceStore = useServiceStore()
const props = defineProps<ImportPlaneProps>()
const emits = defineEmits<ImportPlaneEmits>()

const store = useServiceStore()

const open   = ref(false)
const imei   = ref('')
const remark = ref('')

const { t } = useI18n()

const validImeiList = computed(() => {
  const service = store.services.get(props.selectedId!)
  const imeiType = service?.imeiType || IMEI_TYPE.NONE

  return getSubmitImei(imei.value, imeiType)
})

const unitPrice = computed(() => {
  const service = serviceStore.services.get(props.selectedId!)

  if (!service) return "0.00"
  return service.price
})

const servicePrice = computed(() => {
  if(!props.selectedId) return

  const service = store.services.get(props.selectedId)

  return service!.price
})

const usefulCount = computed(() => {
  if(!props.selectedId) return
  return Math.floor(+uStore.info.credits / servicePrice.value!)
})

function handleSubmit() {
  if (validImeiList.value.length === 0) {
    toast.warning(t('valid.null', { field: 'IMEI/SN' }))
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
    toast.error(t('valid.fileError'))
  }
}
</script>

<template>
  <XPopover v-model="open" close-on-click-outside @closed="handleClosed">
    <template #trigger>
      <XButton :label="t('button.import')" :disabled="!selectedId || disabled" />
    </template>

    <div class="space-y-3 w-80 p-4">
      <XTextarea
        v-model="imei"
        rows="10" autofocus
        @dragover.prevent
        @drop.prevent="handleDrop"
        :placeholder="t('query.imei.placeholder')"
      />
      <XTextarea v-model="remark" :placeholder="t('remark.placeholder')" />

      <div class="flex flex-col">
        <span class="text-sm text-muted-foreground">{{ t('query.prompt.unit', { price: unitPrice }) }}</span>
        <span class="text-sm text-muted-foreground">{{ t('query.prompt.balance') }}: ￥{{ uStore.info.credits }}, {{ t('query.submitCount', { count: usefulCount }) }}</span>
      </div>
      <div class="flex items-center justify-between space-x-2">
        <a
          href="javascript:void(0)" :title="t('query.imei.view')"
          class="text-sm text-muted-foreground hover:bg-muted rounded-md px-2 py-1 -ml-2"
          @click="imei = validImeiList.join('\n')"
        >
          <span class="mr-1">{{ t('query.imei.valid') }}</span>
          <span class="text-primary">{{ validImeiList.length }}</span>
        </a>
        <div class="flex justify-end space-x-2">
          <ButtonGroup
            :layouts="['cancel', 'import']" size="sm"
            @cancel="open = false" @import="handleSubmit"
          />
        </div>
      </div>
    </div>
  </XPopover>
</template>
