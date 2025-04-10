<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { XSelectItemProps } from './select'
import { XSELECT_CONTEXT } from './select'
import { twMerge } from 'tailwind-merge'

defineOptions({ name: 'XSelectItem' })

const props = defineProps<XSelectItemProps>()
const { model, options } = inject(XSELECT_CONTEXT)!
const isActive = computed(() => model.value === props.value)

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
      'flex items-center space-x-1 px-2 py-1 text-sm',
      'hover:bg-muted hover:text-accent-foreground hover:rounded',
      isActive && activeClass, className
    )"
    href="javascript:void(0)"
  >
    <Icon v-if="isActive" icon="lucide:check" class="size-4" />
    <slot><span>{{ label }}</span></slot>
  </a>
</template>
