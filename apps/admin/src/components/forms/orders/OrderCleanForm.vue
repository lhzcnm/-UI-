<script setup lang="ts">
interface OrderCleanForm {
  checked: string
  time: string
}

const form = defineModel<OrderCleanForm>({ required: true })
</script>

<template>
  <form class="space-y-4" @submit.prevent>
    <div>
      <label class="block text-sm text-label mb-2">便捷清理</label>
      <div class="flex items-center space-x-4">
        <XRadio v-model="form.checked" value="7" label="保留7天" />
        <XRadio v-model="form.checked" value="15" label="保留15天" />
        <XRadio v-model="form.checked" value="30" label="保留30天" />
        <XRadio v-model="form.checked" value="auto" label="自定义" />
      </div>
    </div>
    
    <div v-if="form.checked === 'auto'">
      <label class="block text-sm text-label mb-2">自定义日期(该日期之前的订单将被清理)</label>
      <XDatePicker v-model="form.time" placeholder="请选择清理时间" />
    </div>
  </form>
</template>
