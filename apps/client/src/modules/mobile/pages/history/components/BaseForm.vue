<script setup lang="ts">
import type { OrderSearchForm } from '@/api/orders'
import { ORDER_STATUS } from '@3un/utils'

const form = defineModel<OrderSearchForm>({ required: true })
const serviceStore = useServiceStore()
const groupId = ref(-1)
const { t } = useI18n()

const options = computed(() => {
  const findIndex = serviceStore.details.findIndex(item =>
    item.id === groupId.value
  )

  if (findIndex === -1) return []
  return serviceStore.details[findIndex].children
})

const statusOptions = [
  { label: t('order.button.mobile.status.-1'), value: -1 },
  { label: t('order.button.mobile.status.2'), value: ORDER_STATUS.SUCCESS },
  { label: t('order.button.mobile.status.3'), value: ORDER_STATUS.FAILED },
  { label: t('order.button.mobile.status.4'), value: ORDER_STATUS.PROCESSING },
]
</script>

<template>
  <div class="space-y-3">
    <div class="space-y-1">
      <label class="inline-block mb-1 text-sm text-label">{{ t('service.select') }}: </label>
      <div class="flex items-center space-x-2">
        <XNativeSelect
          v-model="groupId"
          :default="-1"
          :options="[...serviceStore.details]"
          @change="form.serviceId = 0"
          :placeholder="t('serviceGroup.placeholder')"
          label-key="title"
          value-key="id"
        />
        <XNativeSelect
          v-model="form.serviceId"
          :options="options"
          :disabled="groupId === -1"
          :default="0"
          :placeholder="t('service.placeholder')"
          label-key="title"
          value-key="id"
        />
      </div>
    </div>

    <div class="space-y-1">
      <label class="text-sm text-label">{{ t('order.listCol.status') }}: </label>
      <XSegmented
        v-model="form.status"
        :options="statusOptions"
        :default-value="-1"
      />
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
      <XTextarea
        v-model="form.codeIds" rows="4"
        :placeholder="t('order.form.orderId.placeholder')"
      />
    </div>

    <div class="space-y-1">
      <label class="inline-block mb-1 text-sm text-label">IMEI/SN:</label>
      <XTextarea
        v-model="form.imei" rows="4"
        placeholder="IMEI/SN"
      />
    </div>
  </div>
</template>
