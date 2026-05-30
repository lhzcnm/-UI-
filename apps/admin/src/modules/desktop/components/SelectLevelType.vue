<script setup lang="ts">
import { PLAN_TYPE_ENUM, PLAN_TYPE_LIST } from '@/utils/enum'

const type = defineModel<PLAN_TYPE_ENUM>({ required: true })
</script>

<template>
  <XSelect
    v-model="type"
  >
    <XSelectItem
      v-for="priceType in PLAN_TYPE_LIST" :key="priceType.value"
      :value="priceType.value" :label="priceType.label"
    />
  </XSelect>
</template>
