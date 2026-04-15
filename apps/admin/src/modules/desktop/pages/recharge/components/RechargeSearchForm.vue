<script setup lang="ts">
import type { RechargeSearchForm } from '@/inters/recharge'
import { PAYMENT_METHOD_LIST, PAYMENT_STATUS_LIST } from '@3un/utils'
import { handleInputChange } from '@/utils'

const form = defineModel<RechargeSearchForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div class="flex space-x-3">
      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">支付方式</label>
        <XSelect v-model="form.paymentMethod" placeholder="选择支付方式" clearable>
          <XSelectItem
            v-for="item in PAYMENT_METHOD_LIST" :key="item.value"
            :value="item.value" :label="item.label"
          />
        </XSelect>
      </div>
      <div class="w-1/2">
        <label class="block text-sm text-label mb-1">支付状态</label>
        <XSelect v-model="form.paymentStatus" placeholder="选择支付状态" clearable>
          <XSelectItem
            v-for="item in PAYMENT_STATUS_LIST" :key="item.value"
            :value="item.value" :label="item.label"
          />
        </XSelect>
      </div>
    </div>
    <div>
      <label class="block text-sm text-label mb-1">支付时间</label>
      <XDateRangePicker
        v-model:start="form.startTime"
        v-model:end="form.endTime"
        label-format="YYYY-MM-DD"
        placeholder="支付时间"
      />
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
