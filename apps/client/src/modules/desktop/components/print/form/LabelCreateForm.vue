<script setup lang="ts">
import type { LabelCreateForm } from '@/types'
import { XFormField } from '@3un/ui'

const form = defineModel<LabelCreateForm>({ required: true })
</script>

<template>
  <form class="divide-y">
    <XFormField label="标签名" desc="自定义标签名(如: 型号)">
      <XInput v-model="form.label" placeholder="请输入标签名" />
    </XFormField>
    <XFormField label="标签内容" desc="自定义标签内容(如: iphone 17)">
      <XInput v-model="form.value" placeholder="请输入标签内容" />
    </XFormField>
  </form>
</template>