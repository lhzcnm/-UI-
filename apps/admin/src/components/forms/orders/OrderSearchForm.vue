<script setup lang="ts">
import type { OrderSearchForm } from '@/inters/orders'
import { ORDER_STATUS_LIST } from '@3un/utils'

const form = defineModel<OrderSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="flex space-x-2">
      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">用户ID</label>
        <XInput v-model="form.userId" placeholder="用户ID" />
      </div>
      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">用户名</label>
        <XInput v-model="form.username" placeholder="用户名" />
      </div>
    </div>

    <div>
      <label class="block text-sm text-label mb-1">服务</label>
      <SelectService v-model="form.serviceId" />
    </div>

    <div>
      <label class="block text-sm text-label mb-1">订单状态</label>
      <XSelect v-model="form.statusId" placeholder="选择订单状态" clearable>
        <XSelectItem
          v-for="status in ORDER_STATUS_LIST" :key="status.value"
          :value="status.value" :label="status.label"
        />
      </XSelect>
    </div>

    <div>
      <label class="block text-sm text-label mb-1">提交时间</label>
      <XDatePicker
        v-model:start="form.startTime"
        v-model:end="form.endTime"
        placeholder="选择提交时间"
      />
    </div>

    <div>
      <label class="block text-sm text-label mb-1">IMEI/SN</label>
      <XTextarea v-model="form.imeiList" placeholder="IMEI/SN，一行一个" />
    </div>
  </form>
</template>
