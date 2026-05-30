<script setup lang="ts">
import { PLAN_TYPE_ENUM, PLAN_TYPE_LIST } from '@/utils/enum'

const type = defineModel<PLAN_TYPE_ENUM>({ required: true })
</script>

<template>
  <XNativeSelect
    v-model="type"
    :options="PLAN_TYPE_LIST"
    value-key="value"
    label-key="label"
  />
</template>
