<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

interface TheEmptyProps {
  title?: string
  image: string
  imageClass?: string
}

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
      :class="twMerge('inline-block max-w-64 mb-4', imageClass)"
      :src="image" alt="NO MESSAGE"
      draggable="false"
    >
    <slot>
      <div>{{ title }}</div>
    </slot>
  </div>
</template>
