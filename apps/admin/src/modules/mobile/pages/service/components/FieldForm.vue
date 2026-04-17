<script setup lang="ts">
import type { ServiceFieldForm } from '@/inters/services'
import { zServiceFieldForm } from '@/inters/services'

const form = defineModel<ServiceFieldForm>({ required: true })
const formRef = useTemplateRef('formRef')

defineExpose({
  validateForm: () => formRef.value!.validateForm(),
  clearErrors: () => formRef.value!.clearErrors(),
})
</script>

<template>
  <XForm ref="formRef" :model="form" :schema="zServiceFieldForm">
    <XFormItem label="服务名称" field="serviceId">
      <NativeSelectService v-model="form.serviceId" />
    </XFormItem>

    <XFormItem label="字段名称" field="name">
      <XInput v-model="form.name" placeholder="字段名称" />
    </XFormItem>

    <XFormItem label="字段名称EN" field="nameEn">
      <XInput v-model="form.nameEn" placeholder="字段名称EN" />
    </XFormItem>

    <XFormItem label="字段宽度">
      <XInputNumber v-model="form.width" :step="10" placeholder="字段宽度" />
    </XFormItem>

    <XFormItem label="排序">
      <XInputNumber v-model="form.sortNum" :step="1" placeholder="排序" />
    </XFormItem>

    <XFormItem label="是否显示">
      <XSwitch v-model="form.status" :active-value="1" :inactive-value="0" />
    </XFormItem>
  </XForm>
</template>
