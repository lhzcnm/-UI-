<script setup lang="ts">
import type { XInputProps } from './input'
import { tv } from 'tailwind-variants'

defineOptions({ name: 'XInput' })
const props = defineProps<XInputProps>()
const value = defineModel<string | number>({ default: '' })

const input = tv({
  base: `
    w-full h-10 sm:h-9 rounded-md px-3
    text-base sm:text-sm bg-transparent border shadow-sm
    focus:outline-none focus:ring-1 focus:ring-primary
    hover:border-hover transition-colors
  `,
})
</script>

<template>
  <input
    v-model="value"
    v-bind="$attrs"
    :type="props.type"
    :class="input({ class: props.class })"
  />
</template>
