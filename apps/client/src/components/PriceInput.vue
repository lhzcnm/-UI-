<script setup lang="ts">
import type { ClassNameValue } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

interface PriceInputProps {
  class?: ClassNameValue,
  placeholder?: string,
}

const props = defineProps<PriceInputProps>()

const input = defineModel<number>({ required: true })

const style = tv({
  slots: {
    root: [
      'inline-flex w-full items-center h-10 pl-2 gap-2',
      'border border-border border-solid rounded-lg bg-transparent shadow-sm',
      'text-md text-black dark:text-white transition-colors',
      'focus-within:ring-2 focus-within:ring-primary focus-within:border-primary',
      'hover:border-primary/60',
    ],
    icon: [
      'flex items-center justify-center text-lg',
      'text-black dark:text-white',
    ],
    input: [
      'w-full bg-transparent border-none outline-none',
      'text-md',
    ],
  },
})

const b = style()
</script>

<template>
  <div :class="b.root({ class: props.class })">
    <span :class="b.icon()">
      ￥
    </span>
    <input
      :class="b.input()"
      type="text"
      placeholder="请输入充值金额"
      v-model="input"
    >
  </div>
</template>
