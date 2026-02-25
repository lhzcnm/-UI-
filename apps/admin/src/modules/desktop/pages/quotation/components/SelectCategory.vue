<script setup lang="ts">
import { QUOTATION_MAP } from '@/utils/quotation'
import { QUOTATION_MAP_LIST } from '../utils'

const category = defineModel<QUOTATION_MAP>()
</script>

<template>
  <XSelect
    ui-trigger="min-w-52"
    clearable
    v-model="category">
    <XSelectItem
      v-for="category in QUOTATION_MAP_LIST"
      :value="category.value" :label="category.label"
    />
  </XSelect>
</template>
