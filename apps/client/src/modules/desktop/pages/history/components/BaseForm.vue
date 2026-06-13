<script setup lang="ts">
import SelectService from '@desktop/components/SelectService.vue'
import type { OrderSearchForm } from '@/api/orders'
import { ORDER_STATUS_LIST } from '@3un/utils'

const form = defineModel<OrderSearchForm>({ required: true })

const localStore = useLocalStore()
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="space-y-1">
      <label class="text-label text-sm">{{ localStore.localData['history_FormService'] }}</label>
      <SelectService v-model="form.serviceId" />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ localStore.localData['history_OrderStatus'] }}</label>
      <XSelect
        v-model="form.status"
        :teleport="false"
      >
        <XSelectItem :value="-1" :label="localStore.localData['history_All']" />
        <XSelectItem
          v-for="item in ORDER_STATUS_LIST" :key="item.value"
          :value="item.value" :label="localStore.localData[item.key]"
        />
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ localStore.localData['history_Date'] }}</label>
      <XDateRangePicker
        v-model:start="form.startTime"
        v-model:end="form.endTime"
        label-format="YYYY-MM-DD"
        :placeholder="localStore.localData['history_TimeRange']"
      />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">{{ localStore.localData['history_OrderID'] }}</label>
      <XTextarea v-model="form.codeIds" :placeholder="localStore.localData['history_EnterOrders']" rows="6" />
    </div>

    <div class="space-y-1">
      <label class="text-label text-sm">IMEI/SN</label>
      <XTextarea
        v-model="form.imei"
        :placeholder="localStore.localData['history_EnterImei']"
        rows="8"
      />
    </div>
  </form>
</template>
