<script setup lang="ts">
import { type ActivityCreate } from '@/inters/activity'
import { ACTIVITY_STATUS } from '@3un/utils'

const form = defineModel<ActivityCreate>({ required: true })

const isEnabled = ref<boolean>(form.value.status === ACTIVITY_STATUS.ENABLE)

watch(
  () => form.value.status,
  (newVal) => {
    isEnabled.value = newVal === ACTIVITY_STATUS.ENABLE
  },
)

watch(
  () => isEnabled.value,
  (value) => {
    if (value) {
      form.value.status = ACTIVITY_STATUS.ENABLE
    } else {
      form.value.status = ACTIVITY_STATUS.DISABLE
    }
  },
)
</script>

<template>
  <form class="divide-y" @submit.prevent>
    <FormField label="活动名称" desc="" variant="vertical" required>
      <XInput placeholder="请输入活动名称" v-model="form.name" />
    </FormField>
    <!-- <FormField label="活动排序" desc="值越小越靠前" required>
      <XInputNumber class="ml-auto" :precision="0" :step="1" v-model="form.sortOrder" />
    </FormField> -->
    <FormField label="启用状态" desc="">
      <XSwitch v-model="isEnabled" class="ml-auto" />
    </FormField>
    <FormField label="开始时间" desc="活动开始时间" required>
      <XDatePicker
        label-format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :visible-time="true"
        v-model="form.startTime"
      />
    </FormField>
    <FormField label="结束时间" desc="活动结束时间" required>
      <XDatePicker
        label-format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
        :visible-time="true"
        v-model="form.endTime"
      />
    </FormField>
    <FormField label="活动描述" desc="" variant="vertical">
      <XTextarea
        placeholder="请输入活动描述"
        rows="6"
        v-model="form.description"
      />
    </FormField>
  </form>
</template>
