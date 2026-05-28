<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { type OrderSearchForm } from '@/api/orders'
import { IMEI_TYPE, IMEIValidator, ORDER_STATUS } from '@3un/utils'
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'
import * as XLSX from 'xlsx'
import { getSubmitImei } from '@/utils'

interface OrderSearchModalEmits {
  filter: [params: OrderSearchForm]
}

const serviceStore = useServiceStore()
const { t } = useI18n()

const emits = defineEmits<OrderSearchModalEmits>()
const visible = defineModel<boolean>({ required: true })

const form = ref<OrderSearchForm>(createInitForm())

const fileInputRef = useTemplateRef('fileInputRef')

let hasFilter: boolean = false

const statusOptions = [
  { label: t('order.button.mobile.status.-1'), value: -1 },
  { label: t('order.button.mobile.status.2'), value: ORDER_STATUS.SUCCESS },
  { label: t('order.button.mobile.status.3'), value: ORDER_STATUS.FAILED },
  { label: t('order.button.mobile.status.4'), value: ORDER_STATUS.PROCESSING },
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
    const imeiList = handleImei(text).join('\n')
    form.value.imei = trimed ? `${trimed}\n${imeiList}` : imeiList
  } catch (error) {
    console.error('[File parse error]', error)
    toast.error(t('query.prompt.file'))
  }
}

function handleImei(text = '') {
  const service = serviceStore.services.get(form.value.serviceId)
  const imeiType = service ? service.imeiType : IMEI_TYPE.NONE
  // const service = serviceStore.services.get(form.serviceId)

  let validList: string[] = []
  if (service) {
    validList = getSubmitImei(text, imeiType, service.domesticSerialType)
  }

  // 防止 IMEI 和 SN 混用时识别为空
  if (validList.length === 0 && imeiType !== IMEI_TYPE.SN) {
    validList = IMEIValidator.findAllImeis(text)
  }

  return validList
}
</script>

<template>
  <TheModal v-model="visible" :title="t('order.title.filter')" class="h-[78%]">
    <template #default>
      <div class="p-4 space-y-3">
        <div class="space-y-1">
          <div class="space-y-1">
            <label class="text-sm text-label">{{ t('order.listCol.status') }}: </label>
            <XSegmented v-model="form.status" :options="statusOptions" :default-value="-1" />
          </div>

          <div class="space-y-1">
            <label class="inline-block mb-1 text-sm text-label">{{ t('date.mobile.title') }}: </label>
            <div class="flex items-center space-x-2">
              <XNativeDate v-model="form.startTime" :placeholder="t('date.mobile.start')" />
              <XNativeDate v-model="form.endTime" :placeholder="t('date.mobile.end')" />
            </div>
          </div>

          <div class="space-y-1">
            <label class="inline-block mb-1 text-sm text-label">{{ t('order.form.orderId.title') }}:</label>
            <XTextarea v-model="form.codeIds" rows="4" :placeholder="t('order.form.orderId.placeholder')" />
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
                <span>{{ t('order.upload.imei') }}</span>
              </button>
            </div>
            <XTextarea v-model="form.imei" rows="4" placeholder="IMEI/SN" />
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2 p-4">
        <XButton color="success" variant="soft" @click="handleReset">{{ t('order.button.mobile.reset') }}</XButton>
        <XButton @click="handleSubmit">{{ t('order.button.mobile.search') }}</XButton>
      </div>

      <input ref="fileInputRef" type="file" hidden accept=".xlsx,.xls,.csv,.txt" @change="handleFileChange" />
    </template>
  </TheModal>
</template>
