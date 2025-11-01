<script setup lang="ts">
import { QUOTATION_TYPE, QUOTATION_MAP_LIST } from '@3un/utils'

const category = defineModel<QUOTATION_TYPE>({ required: true })
</script>

<template>
  <XSelect
    v-model="category">
    <XSelectItem
      v-for="category in QUOTATION_MAP_LIST"
      :value="category.value" :label="category.label"
    />
  </XSelect>
</template>
