<script setup lang="ts">
import { type ServiceFieldForm } from '@/inters/services'

interface BatchFormProps {
  delete: []
}

const form = defineModel<ServiceFieldForm>({ required: true })
const emits = defineEmits<BatchFormProps>()
</script>

<template>
  <div class="border p-2 rounded-md">
    <FormField label="字段名称" desc="字段中文名">
      <XInput v-model="form.name" placeholder="字段名称" />
    </FormField>

    <FormField label="字段名称EN" desc="字段英文名">
      <XInput v-model="form.nameEn" placeholder="字段名称EN" />
    </FormField>

    <FormField label="字段宽度" desc="字段在前台的默认宽度">
      <XInputNumber v-model="form.width" :step="10" placeholder="字段宽度" />
    </FormField>

    <FormField label="排序" desc="字段返回顺序">
      <XInputNumber v-model="form.sortNum" :step="1" placeholder="排序" />
    </FormField>

    <FormField label="是否显示" desc="是否显示字段">
      <XSwitch v-model="form.status" :active-value="1" :inactive-value="0" />
    </FormField>

    <div class="flex justify-end">
      <XButton variant="ghost" label="删除" color="danger" @click="emits('delete')" />
    </div>
  </div>
</template>
