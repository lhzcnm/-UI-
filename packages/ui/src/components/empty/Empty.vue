<script setup lang="ts">
import type { TheEmptyProps } from './empty'
import { twMerge } from 'tailwind-merge'

withDefaults(
  defineProps<TheEmptyProps>(),
  {
    imageClass: '',
    title: '',
  }
)
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full p-4 text-zinc-500 select-none">
    <img
      :class="twMerge('inline-block max-w-64 mb-3', imageClass)"
      :src="image" alt="NOT DATA"
      draggable="false"
    >
    <slot>
      <div class="text-lg">{{ title }}</div>
    </slot>
  </div>
</template>
