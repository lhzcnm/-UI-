<script setup lang="ts">
import type { RechargeSearchForm } from '@/inters/recharge'
import { PAYMENT_METHOD_LIST, PAYMENT_STATUS_LIST } from '@3un/utils'
import { handleInputChange } from '@/utils'

const form = defineModel<RechargeSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="flex space-x-3">
      <div class="flex-1">
        <label class="block text-sm text-label mb-1">支付方式</label>
        <XNativeSelect
          v-model="form.paymentMethod"
          :options="PAYMENT_METHOD_LIST"
          placeholder="选择支付方式"
          value-key="value"
          label-key="label"
        />
      </div>
      <div class="flex-1">
        <label class="block text-sm text-label mb-1">支付状态</label>
        <XNativeSelect
          v-model="form.paymentStatus"
          :options="PAYMENT_STATUS_LIST"
          placeholder="选择支付状态"
          value-key="value"
          label-key="label"
        />
      </div>
    </div>
    <div class="flex space-x-3">
      <div class="flex-1">
        <label class="block text-sm text-label mb-1">开始时间</label>
        <XNativeDate
          v-model="form.startTime"
          label-format="YYYY-MM-DD"
          placeholder="开始时间"
        />
      </div>
      <div class="flex-1">
        <label class="block text-sm text-label mb-1">结束时间</label>
        <XNativeDate
          v-model="form.endTime"
          label-format="YYYY-MM-DD"
          placeholder="结束时间"
        />
      </div>
    </div>
    <div>
      <label class="block text-sm text-label mb-1">用户ID</label>
      <XInput
        v-model="form.userId"
        placeholder="用户ID"
        @input="(e: Event) => form.userId = handleInputChange(e)"
        @change="(e: Event) => form.userId = handleInputChange(e)"
      />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">交易ID</label>
      <XInput v-model="form.transactionId" placeholder="交易ID" />
    </div>
    <div>
      <label class="block text-sm text-label mb-1">管理添加</label>
      <XSwitch v-model="form.byAdmin" />
    </div>
  </form>
</template>
