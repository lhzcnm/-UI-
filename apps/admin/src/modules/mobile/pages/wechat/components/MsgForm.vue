<script setup lang="ts">
import type { CustomMsgCreateParams } from '@/inters/wechat'
import { zCustomMsgForm } from '@/inters/wechat'

const form = defineModel<CustomMsgCreateParams>({ required: true })
const formRef = useTemplateRef('formRef')

defineExpose({
  validateForm: () => formRef.value!.validateForm(),
  clearErrors: () => formRef.value!.clearErrors(),
})
</script>

<template>
  <XForm ref="formRef" :model="form" :schema="zCustomMsgForm">
    <XFormItem field="keywords" label="关键字">
      <XInput v-model="form.keywords" placeholder="例如：你好|您好|在吗" />
    </XFormItem>

    <XFormItem field="content" label="消息内容">
      <XTextarea v-model="form.content" rows="12" placeholder="触发关键字后，发送的消息内容" />
    </XFormItem>
  </XForm>
</template>
