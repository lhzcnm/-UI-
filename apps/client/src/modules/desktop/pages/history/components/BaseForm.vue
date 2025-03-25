<script setup lang="ts">
import SelectService from '@desktop/components/SelectService.vue'
import type { OrderSearchForm } from '@/api/orders'
import { ORDER_STATUS_LIST } from '@3un/shared/enums'

const form = defineModel<OrderSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">服务</label>
      <SelectService width="336px" v-model="form.serviceId" />
    </div>

    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">订单状态</label>
      <XSelect
        v-model="form.status"
        :teleport="false"
        placeholder="请选择订单状态"
        width="336px"
      >
        <XSelectItem
          value="all" label="全部"
          active-class="border-l-[5px] border-blue-500 italic"
        />
        <XSelectItem
          v-for="item in ORDER_STATUS_LIST" :key="item.value"
          :value="item.value" :label="item.label"
          active-class="border-l-[5px] border-blue-500 italic"
        />
      </XSelect>
    </div>

    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">日期</label>
      <XDatePicker
        v-model:start="form.startTime"
        v-model:end="form.endTime"
        label-format="YYYY-MM-DD"
      />
    </div>

    <div class="space-y-1">
      <label class="text-muted-foreground text-sm">IMEI/SN</label>
      <XTextarea
        v-model="form.imei"
        placeholder="请输入IMEI/SN"
        rows="8"
      />
    </div>
  </form>
</template>
