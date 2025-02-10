<script setup lang="ts">
import { tv } from 'tailwind-variants'
import type { XTagProps } from './tag'

defineOptions({ name: 'XTag' })
defineProps<XTagProps>()

const tag = tv({
  base: 'px-2 py-1 text-center text-xs shadow-sm',
  variants: {
    color: {
      gray: 'bg-gray-600/20 text-gray-600',
      emerald: 'bg-emerald-600/20 text-emerald-600',
      red: 'bg-red-600/20 text-red-600',
      blue: 'bg-blue-600/20 text-blue-600',
    },
    shape: {
      square: 'rounded-none',
      default: 'rounded-md',
      round: 'rounded-full',
    },
  },
  defaultVariants: {
    color: 'gray',
    shape: 'default',
  },
})
</script>

<template>
  <span :class="tag({ color, shape })">
    <slot>{{ label }}</slot>
  </span>
</template>
