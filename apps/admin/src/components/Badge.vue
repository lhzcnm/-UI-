<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
interface BadgeProps {
  value: number
}

defineProps<BadgeProps>()
</script>

<template>
  <span
    :class="twJoin(
      'inline-flex items-center justify-center min-w-4 h-4',
      'text-xs bg-emerald-500 text-white rounded-full px-1.5',
    )"
  >
    {{ value }}
  </span>
</template>
