<script setup lang="ts">
import type { RechargePackageForm } from '@/inters/recharge'
import { zRechargePackageForm } from '@/inters/recharge'

const form = defineModel<RechargePackageForm>({ required: true })
const formRef = useTemplateRef('formRef')

defineExpose({
  validateForm: () => formRef.value!.validateForm(),
  clearErrors: () => formRef.value!.clearErrors(),
})
</script>

<template>
  <XForm ref="formRef" :model="form" :schema="zRechargePackageForm">
    <XFormItem field="shopName" label="商品名称">
      <XInput v-model="form.shopName" placeholder="请输入商品名称" />
    </XFormItem>

    <XFormItem label="价格">
      <XInputNumber v-model="form.price" :min="1" :step="1" />
    </XFormItem>

    <XFormItem label="月数">
      <XInputNumber v-model="form.month" :min="1" :step="1" />
    </XFormItem>
  </XForm>
</template>
