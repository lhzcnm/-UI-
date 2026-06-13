<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { type OrderSearchForm } from '@/api/orders'
import { ORDER_STATUS } from '@3un/utils'
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'
import * as XLSX from 'xlsx'

interface OrderSearchModalEmits {
  filter: [params: OrderSearchForm]
}

// const { t } = useI18n()
const localStore = useLocalStore()

const emits = defineEmits<OrderSearchModalEmits>()
const visible = defineModel<boolean>({ required: true })

const form = ref<OrderSearchForm>(createInitForm())

const fileInputRef = useTemplateRef('fileInputRef')

let hasFilter: boolean = false

const statusOptions = [
  { label: localStore.localData['submit_FieldsDialogAll'], value: -1 },
  { label: localStore.localData['submit_Success'], value: ORDER_STATUS.SUCCESS },
  { label: localStore.localData['submit_Failed'], value: ORDER_STATUS.FAILED },
  { label: localStore.localData['submit_Processing'], value: ORDER_STATUS.PROCESSING },
]

watch(
  () => visible.value,
  (val) => {
    if (val && !hasFilter) {
      form.value = createInitForm()
    }
  }
)

function createInitForm(): OrderSearchForm {
  return {
    serviceId: 0,
    status: -1,
    imei: '',
    startTime: '',
    endTime: '',
    codeIds: '',
  }
}

function handleReset() {
  form.value = createInitForm()
  hasFilter = false
}

function handleSubmit() {
  emits('filter', form.value)
  hasFilter = true
  visible.value = false
}

function handleFileInput() {
  fileInputRef.value?.click()
}

async function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files![0]
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

    const trimed = form.value.imei.trim()
    const imeiList = text
    form.value.imei = trimed ? `${trimed}\n${imeiList}` : imeiList
  } catch (error) {
    console.error('[File parse error]', error)
    toast.error(localStore.localData['submit_ImportFileError'])
  }
}
</script>

<template>
  <TheModal v-model="visible" :title="localStore.localData['submit_FilterOrders']" class="h-[78%]">
    <template #default>
      <div class="p-4 space-y-3">
        <div class="space-y-1">
          <div class="space-y-1">
            <label class="text-sm text-label">{{ localStore.localData['submit_OrderStatusTable'] }}: </label>
            <XSegmented v-model="form.status" :options="statusOptions" :default-value="-1" />
          </div>

          <div class="space-y-1">
            <label class="inline-block mb-1 text-sm text-label">{{ localStore.localData['submit_SubmitTime'] }}: </label>
            <div class="flex items-center space-x-2">
              <XNativeDate v-model="form.startTime" :placeholder="localStore.localData['submit_StartTime']" />
              <XNativeDate v-model="form.endTime" :placeholder="localStore.localData['submit_EndTime']" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="inline-block mb-1 text-sm text-label">{{ localStore.localData['submit_OrderID'] }}:</label>
            <XTextarea v-model="form.codeIds" rows="4" :placeholder="localStore.localData['submit_ImportOrderID']" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="inline-block mb-1 text-sm text-label">IMEI/SN:</label>
              <button 
                :class="twJoin(
                  'p-1 rounded flex items-center justify-center space-x-2 text-xs',
                  'bg-muted text-muted-foreground',
                )"
                @click="handleFileInput"
              >
                <Icon icon="lucide:file-input" />
                <span>{{ localStore.localData['submit_UploadFile'] }}</span>
              </button>
            </div>
            <XTextarea v-model="form.imei" rows="4" placeholder="IMEI/SN" />
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2 p-4">
        <XButton color="success" variant="soft" @click="handleReset">{{ localStore.localData['submit_ResetForm'] }}</XButton>
        <XButton @click="handleSubmit">{{ localStore.localData['submit_FilterOrders'] }}</XButton>
      </div>

      <input ref="fileInputRef" type="file" hidden accept=".xlsx,.xls,.csv,.txt" @change="handleFileChange" />
    </template>
  </TheModal>
</template>
