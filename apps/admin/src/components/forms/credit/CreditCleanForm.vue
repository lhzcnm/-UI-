<script setup lang="ts">
import type { CreditCleanForm } from '@/inters/credits'
const form = defineModel<CreditCleanForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-2">便捷清理</label>
      <div class="flex items-center space-x-4">
        <XRadio v-model="form.checked" value="90" label="保留90天" />
        <XRadio v-model="form.checked" value="180" label="保留180天" />
        <XRadio v-model="form.checked" value="360" label="保留360天" />
        <XRadio v-model="form.checked" value="auto" label="自定义" />
      </div>
    </div>
    
    <div v-if="form.checked === 'auto'">
      <label class="block text-sm text-label mb-2">自定义日期(该日期之前的记录将被清理)</label>
      <XDatePicker v-model="form.time" placeholder="请选择清理时间" />
    </div>
  </form>
</template>
