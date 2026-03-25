<script setup lang="ts">
import { ACCESS_LEVEL, ACCESS_LEVEL_LIST } from '@3un/utils'

const accessLevel = defineModel<ACCESS_LEVEL>({ required: true })
</script>

<template>
  <XNativeSelect
    v-model="accessLevel"
    :options="ACCESS_LEVEL_LIST"
    label-key="label"
    value-key="value"
  />
</template>
