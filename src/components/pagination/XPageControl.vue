<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { twMerge } from 'tailwind-merge'
import type { XPageControlProps } from './pagination'

defineProps<XPageControlProps>()
</script>

<template>
  <button
    :class="twMerge(
      'inline-flex items-center justify-center [&>svg]:size-5',
      'size-9 p-1 bg-primary text-primary-foreground rounded shadow-sm',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    )"
    :disabled
  >
    <Icon :icon="type === 'prev' ? 'lucide:chevron-left' : 'lucide:chevron-right'" />
  </button>
</template>
