<script setup lang="ts">
import type { XTextareaProps } from './textarea'
import { twMerge } from 'tailwind-merge'

defineOptions({ name: 'XTextarea' })
defineProps<XTextareaProps>()

const value = defineModel({ default: '' })
</script>

<template>
  <textarea
    v-model="value"
    :class="twMerge(
      'w-full border rounded-md px-3 py-2',
      'text-base sm:text-sm bg-transparent border shadow-sm',
      'focus:outline-none focus:ring-1 focus:ring-primary',
      'hover:border-hover transition-colors'
    )"
  />
</template>
