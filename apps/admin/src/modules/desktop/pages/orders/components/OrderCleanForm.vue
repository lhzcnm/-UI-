<script setup lang="ts">
import type { OrderAutoCleanSettings, OrderCleanForm } from '@/inters/orders'

const form = defineModel<OrderCleanForm>({ required: true })
const autoCleanForm = defineModel<OrderAutoCleanSettings>('auto', { required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-2">便捷清理</label>
      <div class="flex items-center flex-wrap space-x-4">
        <XRadio v-model="form.checked" value="7" label="保留7天" />
        <XRadio v-model="form.checked" value="15" label="保留15天" />
        <XRadio v-model="form.checked" value="30" label="保留30天" />
        <XRadio v-model="form.checked" value="custom" label="自定义" />
        <XRadio v-model="form.checked" value="auto" label="自动清理" />
      </div>
    </div>

    
    <div v-if="form.checked === 'custom'">
      <label class="block text-sm text-label mb-2">自定义日期(该日期之前的订单将被清理)</label>
      <XDatePicker v-model="form.time" placeholder="请选择清理时间" value-format="YYYY-MM-DD" label-format="YYYY-MM-DD" />
    </div>

    <OrderAutoCleanForm v-else-if="form.checked === 'auto'" v-model="autoCleanForm" />
  </form>
</template>
