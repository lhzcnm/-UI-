<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { OrderSearchForm } from '@/api/orders'
import { IMEI_TYPE, IMEIValidator, ORDER_STATUS } from '@3un/utils'
import { twJoin } from 'tailwind-merge'
import { toast } from 'vue-sonner'
import * as XLSX from 'xlsx'
import { getSubmitImei } from '@/utils'

const form = defineModel<OrderSearchForm>({ required: true })
const serviceStore = useServiceStore()
const groupId = ref(-1)
// const { t } = useI18n()
const localStore = useLocalStore()

const fileInputRef = useTemplateRef('fileInputRef')

const options = computed(() => {
  const findIndex = serviceStore.details.findIndex(item =>
    item.id === groupId.value
  )

  if (findIndex === -1) return []
  return serviceStore.details[findIndex].children
})

const statusOptions = [
  { label: localStore.localData['history_All'], value: -1 },
  { label: localStore.localData['history_SuccessLabel'], value: ORDER_STATUS.SUCCESS },
  { label: localStore.localData['history_Failed'], value: ORDER_STATUS.FAILED },
  { label: localStore.localData['history_Process'], value: ORDER_STATUS.PROCESSING },
]

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
    toast.error(localStore.localData['history_FailedFile'])
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

function handleFileInput() {
  fileInputRef.value?.click()
}
</script>

<template>
  <div class="space-y-3">
    <div class="space-y-1">
      

      <label class="inline-block mb-1 text-sm text-label">{{ localStore.localData['history_SelectService'] }}: </label>
      <div class="flex items-center space-x-2">
        <XNativeSelect v-model="groupId" :default="-1" :options="[...serviceStore.details]" @change="form.serviceId = 0"
          :placeholder="localStore.localData['history_SelectGroup']" label-key="title" value-key="id" />
        <XNativeSelect v-model="form.serviceId" :options="options" :disabled="groupId === -1" :default="0"
          :placeholder="localStore.localData['history_Service_Select']" label-key="title" value-key="id" />
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-sm text-label">{{ localStore.localData['history_TableHeadOrderStatus'] }}: </label>
      <XSegmented v-model="form.status" :options="statusOptions" :default-value="-1" />
    </div>

    <div class="space-y-1">
      <label class="inline-block mb-1 text-sm text-label">{{ localStore.localData['history_TableHeadSubmitTime'] }}: </label>
      <div class="flex items-center space-x-2">
        <XNativeDate v-model="form.startTime" :placeholder="localStore.localData['history_StartTime']" />
        <XNativeDate v-model="form.endTime" :placeholder="localStore.localData['history_EndTime']" />
      </div>
    </div>

    <div class="space-y-1">
      <label class="inline-block mb-1 text-sm text-label">{{ localStore.localData['history_OrderID'] }}:</label>
      <XTextarea v-model="form.codeIds" rows="4" :placeholder="localStore.localData['history_EnterOrders']" />
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
          <span>{{ localStore.localData['history_ImportIMEI'] }}</span>
        </button>
      </div>
      <XTextarea v-model="form.imei" rows="4" placeholder="IMEI/SN" />
    </div>

    <input ref="fileInputRef" type="file" hidden accept=".xlsx,.xls,.csv,.txt" @change="handleFileChange" />
  </div>
</template>
