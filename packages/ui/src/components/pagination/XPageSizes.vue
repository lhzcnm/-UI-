<script setup lang="ts">
import { XSelect, XSelectItem } from '../select'
import type { XPageSizesProps } from './pagination'

defineProps<XPageSizesProps>()
const selected = defineModel<number>()
</script>

<template>
  <XSelect v-model="selected" width="128px">
    <XSelectItem
      v-for="size in sizes" :key="size"
      :value="size" :label="`${size} 条/页`"
      active-class="bg-blue-500 text-zinc-100 rounded"
    />
  </XSelect>
</template>
