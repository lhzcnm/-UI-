<script setup lang="ts">
import { type IllustrateSubmitForm } from '@/inters/illustrate'

interface IllustrateFormProps {
  disableEditCode: boolean
}

const props = defineProps<IllustrateFormProps>()

const form = defineModel<IllustrateSubmitForm>({ required: true })

const codePrompt = computed(() => (
  props.disableEditCode
    ? '说明文档模块名(不可修改)'
    : '说明文档模块名(确认后不可修改, 请谨慎)'
))
</script>

<template>
  <form class="divide-y">
    <XFormField label="模块" :desc="codePrompt">
      <XInput placeholder="请输入模块名" v-model="form.serviceCode" :disabled="disableEditCode" />
    </XFormField>

    <XFormField label="模块描述" desc="说明文档模块描述">
      <XInput placeholder="请输入描述" v-model="form.description" />
    </XFormField>
  </form>
</template>
