<script setup lang="ts">
import type { ServiceGroupCreateParams } from '@/inters/services'
import { zServiceGroupForm } from '@/inters/services'

const form = defineModel<ServiceGroupCreateParams>({ required: true })
const formRef = useTemplateRef('formRef')

defineExpose({
  validateForm: () => formRef.value!.validateForm(),
  clearErrors: () => formRef.value!.clearErrors(),
})
</script>

<template>
  <XForm ref="formRef" :model="form" :schema="zServiceGroupForm">
    <XFormItem label="服务组名称" field="category">
      <XInput v-model="form.category" placeholder="服务组名称" />
    </XFormItem>

    <XFormItem label="服务组英文名称" field="categoryLocal">
      <XInput v-model="form.categoryLocal" placeholder="服务组英文名称" />
    </XFormItem>

    <XFormItem label="排序">
      <XInputNumber v-model="form.orderBy" :step="1" placeholder="排序数值" />
    </XFormItem>

    <XFormItem label="禁用服务组">
      <XSwitch
        v-model="form.disableCategory"
        :active-value="1"
        :inactive-value="0"
      />
    </XFormItem>
  </XForm>
</template>
