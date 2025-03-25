<script setup lang="ts">
import type { XInputProps } from './input'
import { tv } from 'tailwind-variants'

defineOptions({ name: 'XInput' })
const props = defineProps<XInputProps>()
const value = defineModel<string | number>({ default: '' })

const input = tv({
  base: `
    w-full h-10 sm:h-9 rounded-md px-3 shadow-sm
    text-sm bg-transparent border border-input
    focus:outline-none focus:ring-1 focus:ring-primary
    hover:border-hover transition-colors
  `,
})
</script>

<template>
  <input
    v-model="value"
    :class="input({ class: props.class })"
  />
</template>
