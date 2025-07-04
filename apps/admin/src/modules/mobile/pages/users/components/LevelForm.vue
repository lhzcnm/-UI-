<script setup lang="ts">
import type { LevelCreateParams } from '@/inters/level'
import { zLevelForm } from '@/inters/level'

const form = defineModel<LevelCreateParams>({ required: true })
const formRef = useTemplateRef('formRef')

defineExpose({
  validateForm: () => formRef.value!.validateForm(),
  clearErrors: () => formRef.value!.clearErrors(),
})
</script>

<template>
  <XForm ref="formRef" :model="form" :schema="zLevelForm">
    <XFormItem field="pricePlan" label="等级名称">
      <XInput v-model="form.pricePlan" placeholder="等级名称" />
    </XFormItem>

    <XFormItem field="pricePlanLocal" label="等级名称EN">
      <XInput v-model="form.pricePlanLocal" placeholder="等级名称EN" />
    </XFormItem>

    <XFormItem label="允许访问设备页面">
      <XSwitch v-model="form.enableDevice" />
    </XFormItem>

    <XFormItem label="禁用">
      <XSwitch v-model="form.disablePricePlan" />
    </XFormItem>
  </XForm>
</template>
