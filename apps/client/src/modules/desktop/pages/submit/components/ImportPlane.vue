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

const localStore = useLocalStore()


const validImeiList = computed(() => {
  const service = store.services.get(props.selectedId!)
  const imeiType = service?.imeiType || IMEI_TYPE.NONE

  return getSubmitImei(imei.value, imeiType, service?.domesticSerialType)
})

const unitPrice = computed(() => {
  const service = serviceStore.services.get(props.selectedId!)

  if (!service) return "0.00"
  return service.price.toString()
})

const servicePrice = computed(() => {
  if(!props.selectedId) return

  const service = store.services.get(props.selectedId)

  return service!.price
})

const usefulCount = computed(() => {
  if(!props.selectedId) return ""
  return (Math.floor(+uStore.info.credits / servicePrice.value!).toString())
})

function handleSubmit() {
  if (validImeiList.value.length === 0) {
    toast.warning(localStore.localData['submit_NullImei'])
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
    } else if (['xlsx', 'xls'].includes(extension)) {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer)
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })
      text = data.flat().filter(Boolean).join('\n')
    }

    imei.value = text
  } catch (error) {
    console.error('[File parse error]', error)
    toast.error(localStore.localData['submit_ImportFileError'])
  }
}
</script>

<template>
  <XPopover v-model="open" close-on-click-outside @closed="handleClosed">
    <template #trigger>
      <XButton :label="localStore.localData['submit_Import']" :disabled="!selectedId || disabled" />
    </template>

    <div class="space-y-3 w-80 p-4">
      <XTextarea
        v-model="imei"
        rows="10" autofocus
        @dragover.prevent
        @drop.prevent="handleDrop"
        :placeholder="localStore.localData['submit_ImportIMEIPlaceholder']"
      />
      <XTextarea v-model="remark" :placeholder="localStore.localData['submit_ImportRemarkPlaceholder']" />

      <div class="flex flex-col">
        
        <span class="text-sm text-muted-foreground">{{ localStore.localData['submit_ImportUnitPrice'].replace('@', unitPrice) }}</span>
        <span class="text-sm text-muted-foreground">{{ localStore.localData['submit_ImportBlance'] }}: ￥{{ uStore.info.credits }}, {{ localStore.localData['submit_ImportSubmitOrder'].replace('@', usefulCount) }}</span>
      </div>
      <div class="flex items-center justify-between space-x-2">
        <a
          href="javascript:void(0)" :title="localStore.localData['submit_ImportValidIMEI']"
          class="text-sm text-muted-foreground hover:bg-muted rounded-md px-2 py-1 -ml-2"
          @click="imei = validImeiList.join('\n')"
        >
          <span class="mr-1">{{ localStore.localData['submit_ImportVaildQuantity'] }}</span>
          <span class="text-primary">{{ validImeiList.length }}</span>
        </a>
        <div class="flex justify-end space-x-2">
          <ButtonGroup
            :layouts="['cancel', 'import']" size="sm"
            :labels="{
              cancel:localStore.localData['submit_ImportCancel'],
              import:localStore.localData['submit_ImportButton']
              }"
            @cancel="open = false" @import="handleSubmit"
          />
        </div>
      </div>
    </div>
  </XPopover>
</template>
