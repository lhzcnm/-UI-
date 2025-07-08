<script setup lang="ts">
import type { OrderSearchForm } from '@/inters/orders'
import { ORDER_STATUS_LIST, ORDER_VERIFY_LIST } from '@3un/utils'

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

    <div class="flex space-x-2">
      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">订单状态</label>
        <XNativeSelect
          v-model="form.statusId"
          :options="ORDER_STATUS_LIST"
          :default="undefined"
          placeholder="选择订单状态"
          value-key="value"
          label-key="label"
        />
      </div>

      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">验证状态</label>
        <XNativeSelect
          v-model="form.verify"
          :options="ORDER_VERIFY_LIST"
          :default="undefined"
          placeholder="选择验证状态"
          value-key="value"
          label-key="label"
        />
      </div>
    </div>

    <div>
      <label class="block text-sm text-label mb-1">服务</label>
      <NativeSelectService v-model="form.serviceId" />
    </div>

    <div class="flex space-x-2">
      <div class="flex-1">
        <label class="block text-sm text-label mb-1">开始时间</label>
        <XNativeDate v-model="form.startTime" placeholder="选择开始时间" />
      </div>
      <div class="flex-1">
        <label class="block text-sm text-label mb-1">结束时间</label>
        <XNativeDate v-model="form.endTime" placeholder="选择结束时间" />
      </div>
    </div>

    <div>
      <label class="block text-sm text-label mb-1">IMEI/SN</label>
      <XTextarea v-model="form.imeiList" placeholder="IMEI/SN，一行一个" rows="5" />
    </div>
  </form>
</template>
