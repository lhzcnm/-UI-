<script setup lang="ts">
import { tv } from 'tailwind-variants'
import type { XTagProps } from './tag'

defineOptions({ name: 'XTag' })
defineProps<XTagProps>()

const tag = tv({
  base: 'px-2 py-1 text-center',
  variants: {
    color: {
      zinc: 'bg-zinc-600/20 text-zinc-600',
      emerald: 'bg-emerald-600/20 text-emerald-600',
      rose: 'bg-rose-600/20 text-rose-600',
      blue: 'bg-blue-600/20 text-blue-600',
    },
    shape: {
      square: 'rounded-none',
      default: 'rounded-md',
      round: 'rounded-full',
    },
    size: {
      sm: 'px-2 py-0.5 text-[0.7rem]',
      md: 'px-2 py-1 text-xs',
    },
  },
  defaultVariants: {
    color: 'zinc',
    shape: 'default',
    size: 'md',
  },
})
</script>

<template>
  <span :class="tag({ color, shape, size })">
    <slot>{{ label }}</slot>
  </span>
</template>
