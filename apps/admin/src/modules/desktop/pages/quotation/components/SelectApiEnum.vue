<script setup lang="ts">
import type { ApiEnum } from '@/inters/quotation'
import type { ClassNameValue } from 'tailwind-merge';

interface SelectBrandProps {
  apiEnums: ApiEnum[],
  class?: ClassNameValue,
}

const props = defineProps<SelectBrandProps>()

const code = defineModel<number>()
</script>

<template>
  <XSelect
    :ui-trigger="props.class"
    clearable
    v-model="code">
    <XSelectItem
      v-for="category in apiEnums"
      :value="category.code" :label="category.descCn"
    />
  </XSelect>
</template>
