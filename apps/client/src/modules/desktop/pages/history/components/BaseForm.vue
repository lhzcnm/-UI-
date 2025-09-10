<script setup lang="ts">
import SelectService from '@desktop/components/SelectService.vue'
import type { OrderSearchForm } from '@/api/orders'
import { ORDER_STATUS_LIST } from '@3un/utils'

const form = defineModel<OrderSearchForm>({ required: true })

const { t } = useI18n()
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('service.title') }}</label>
      <SelectService v-model="form.serviceId" />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('order.form.status.title') }}</label>
      <XSelect
        v-model="form.status"
        :teleport="false"
        :placeholder="t('order.form.status.placeholder')"
      >
        <XSelectItem :value="-1" :label="t('all')" />
        <XSelectItem
          v-for="item in ORDER_STATUS_LIST" :key="item.value"
          :value="item.value" :label="item.label"
        />
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ t('date.title') }}</label>
      <XDateRangePicker
        v-model:start="form.startTime"
        v-model:end="form.endTime"
        label-format="YYYY-MM-DD"
        :placeholder="t('date.placeholder')"
      />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">IMEI/SN</label>
      <XTextarea
        v-model="form.imei"
        :placeholder="t('imei.placeholder')"
        rows="8"
      />
    </div>
  </form>
</template>
