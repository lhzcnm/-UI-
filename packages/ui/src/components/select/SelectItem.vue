<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

import type { XSelectItemProps, XSelectItemSlots } from './select'
import { XSELECT_CONTEXT } from './select'

defineOptions({ name: 'XSelectItem' })

const props = defineProps<XSelectItemProps>()
const { model, options } = inject(XSELECT_CONTEXT)!
const isActive = computed(() => model.value === props.value)

const slot = defineSlots<XSelectItemSlots>()
const defaultSlot = slot.default
  ? slot.default()
  : []

const children = defaultSlot[0]?.children
const isString = typeof children === 'string'
const label = props.label || (isString ? children : undefined)

options.value.push({
  label: label || String(props.value),
  value: props.value,
})
</script>

<template>
  <a
    v-bind="$attrs"
    :data-value="value"
    :class="twMerge(
      'flex items-center px-2 py-1 text-sm',
      'hover:bg-muted hover:text-accent-foreground hover:rounded',
      isActive && activeClass, className
    )"
    href="javascript:void(0)"
  >
    <Icon
      v-if="isActive" icon="lucide:check"
      class="inline-block size-4 mr-2"
    />
    <slot><span>{{ label || value }}</span></slot>
  </a>
</template>
