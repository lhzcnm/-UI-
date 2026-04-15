<script setup lang="ts">
import type { CreditCleanForm } from '@/inters/credits'
import type { AutoCleanSettings } from '@/inters/settings';

const form = defineModel<CreditCleanForm>({ required: true })
const autoCleanForm = defineModel<AutoCleanSettings>('auto', { required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-2">便捷清理</label>
      <div class="grid grid-cols-4 gap-4">
        <XRadio v-model="form.checked" value="90" label="保留90天" />
        <XRadio v-model="form.checked" value="180" label="保留180天" />
        <XRadio v-model="form.checked" value="360" label="保留360天" />
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
