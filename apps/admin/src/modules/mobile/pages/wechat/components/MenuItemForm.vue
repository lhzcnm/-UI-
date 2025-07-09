<script setup lang="ts">
import type { WechatMenuCreateParams } from '@/inters/wechat'
import { zWechatMenuItemForm } from '@/inters/wechat'

interface MenuItemFormProps {
  menuTypes: {
    label: string
    value: string
  }[]
}

const props = defineProps<MenuItemFormProps>()
const form = defineModel<WechatMenuCreateParams>({ required: true })

const formRef = useTemplateRef('formRef')

defineExpose({
  validateForm: () => formRef.value!.validateForm(),
  clearErrors: () => formRef.value!.clearErrors(),
})
</script>

<template>
  <XForm ref="formRef" :model="form" :schema="zWechatMenuItemForm">
    <XFormItem field="name" label="菜单名称">
      <XInput v-model="form.name" placeholder="请输入菜单名称" />
    </XFormItem>

    <XFormItem field="type" label="菜单类型">
      <XNativeSelect
        v-model="form.type"
        :default="''"
        :options="props.menuTypes"
        placeholder="请选择菜单类型"
        value-key="value"
        label-key="label"
      />
    </XFormItem>

    <XFormItem field="key" label="KEY/URL">
      <XTextarea v-model="form.key" placeholder="请输入KEY/URL" rows="6" />
    </XFormItem>

    <XFormItem label="排序">
      <XInputNumber v-model="form.orderBy" :step="1" :min="0" />
    </XFormItem>

    <XFormItem label="禁用">
      <XSwitch v-model="form.menuDisable" />
    </XFormItem>
  </XForm>
</template>
