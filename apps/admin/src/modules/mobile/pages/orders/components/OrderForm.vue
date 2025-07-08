<script setup lang="ts">
import type { OrderUpdateForm } from '@/inters/orders'
import { ORDER_STATUS_LIST } from '@3un/utils'

const form = defineModel<OrderUpdateForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-1">IMEI/SN</label>
      <XInput v-model="form.imeiNo" disabled />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">订单状态</label>
      <XNativeSelect
        v-model="form.codeStatusId"
        :options="ORDER_STATUS_LIST"
        value-key="value"
        label-key="label"
      />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">订单结果</label>
      <XTextarea v-model="form.code" placeholder="订单结果" rows="8" />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">上游订单信息</label>
      <XInput v-model="form.messageFromServer" placeholder="上游返回的订单信息" />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">上游订单号</label>
      <XInput v-model="form.orderIdFromServer" placeholder="上游返回的订单号" />
    </div>
  </form>
</template>
