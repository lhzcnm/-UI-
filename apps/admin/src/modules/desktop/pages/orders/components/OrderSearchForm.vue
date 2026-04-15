<script setup lang="ts">
import type { OrderSearchForm } from '@/inters/orders'
import { ORDER_STATUS_LIST, ORDER_VERIFY_LIST } from '@3un/utils'
import { handleInputChange } from '@/utils'

const form = defineModel<OrderSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="flex space-x-2">
      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">用户ID</label>
        <XInput
          v-model="form.userId"
          placeholder="用户ID"
          @input="(e: Event) => form.userId = handleInputChange(e)"
          @change="(e: Event) => form.userId = handleInputChange(e)"
        />
      </div>
      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">用户名</label>
        <XInput v-model="form.username" placeholder="用户名" />
      </div>
    </div>

    <div class="flex space-x-2">
      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">订单状态</label>
        <XSelect v-model="form.statusId" placeholder="选择订单状态" clearable>
          <XSelectItem
            v-for="status in ORDER_STATUS_LIST" :key="status.value"
            :value="status.value" :label="status.label"
          />
        </XSelect>
      </div>

      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">验证状态</label>
        <XSelect v-model="form.verify" placeholder="选择验证状态" clearable>
          <XSelectItem
            v-for="verify in ORDER_VERIFY_LIST" :key="verify.value"
            :value="verify.value" :label="verify.label"
          />
        </XSelect>
      </div>
    </div>

    <div>
      <label class="block text-sm text-label mb-1">服务</label>
      <SelectService v-model="form.serviceId" clearable />
    </div>

    <div>
      <label class="block text-sm text-label mb-1">提交时间</label>
      <XDateRangePicker
        v-model:start="form.startTime"
        v-model:end="form.endTime"
        label-format="YYYY-MM-DD"
        placeholder="选择提交时间"
      />
    </div>

    <div>
      <label class="block text-sm text-label mb-1">IMEI/SN</label>
      <XTextarea v-model="form.imeiList" placeholder="IMEI/SN，一行一个" rows="5" />
    </div>
  </form>
</template>
