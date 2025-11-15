<script setup lang="ts">
import { QuotationMap, QUOTATION_MAP_LIST } from '../utils'

const category = defineModel<QuotationMap>({ required: true })
</script>

<template>
  <XSelect
    ui-trigger="min-w-52"
    v-model="category">
    <XSelectItem
      v-for="category in QUOTATION_MAP_LIST"
      :value="category.value" :label="category.label"
    />
  </XSelect>
</template>
