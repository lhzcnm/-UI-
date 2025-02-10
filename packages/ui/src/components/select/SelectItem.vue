<script setup lang="ts">
import type { XSelectItemProps } from './select'
import { XSelectKey } from './select'
import { twMerge } from 'tailwind-merge'

defineOptions({ name: 'XSelectItem' })

const props = defineProps<XSelectItemProps>()

const { handleClick, model, options } = inject(XSelectKey)!
options.value.push({
  label: props.label ?? '',
  value: props.value,
})
</script>

<template>
  <a
    href="javascript:void(0)"
    :class="twMerge(
      'flex items-center justify-between gap-1 px-2 py-1 text-sm',
      'hover:bg-blue-500 hover:text-zinc-100 hover:rounded',
      model === value && activeClass,
    )"
    v-bind="$attrs"
    @click="handleClick(value)"
  >
    <slot>{{ label }}</slot>
  </a>
</template>
