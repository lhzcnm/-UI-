<script setup lang="ts">
import type { XSelectItemProps } from './select'
import { XSELECT_CONTEXT } from './select'
import { twMerge } from 'tailwind-merge'

defineOptions({ name: 'XSelectItem' })

const props = defineProps<XSelectItemProps>()
const { model, options } = inject(XSELECT_CONTEXT)!

options.value.push({
  label: props.label ?? '',
  value: props.value,
})
</script>

<template>
  <a
    v-bind="$attrs"
    :data-value="value"
    :class="twMerge(
      'flex items-center justify-between space-x-1 px-2 py-1 text-sm',
      'hover:bg-blue-500 hover:text-zinc-100 hover:rounded',
      model === value && activeClass, className
    )"
    href="javascript:void(0)"
  >
    <slot>{{ label }}</slot>
  </a>
</template>
