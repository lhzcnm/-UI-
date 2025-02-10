<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { BtnProps } from './button'
import { tv } from 'tailwind-variants'

defineOptions({ name: 'XButton' })

const props = defineProps<BtnProps>()

const button = tv({
  base: `
    inline-flex items-center justify-center gap-2
    text-base sm:text-sm whitespace-nowrap rounded-md
    active:scale-[0.98] active:translate-y-[1px]
    will-change-transform transition-colors duration-300
  `,
  variants: {
    color: {
      primary: 'bg-primary hover:bg-primary/80',
      emerald: 'bg-emerald-500 hover:bg-emerald-500/80',
      amber: 'bg-amber-600 hover:bg-amber-600/80',
      rose: 'bg-rose-600 hover:bg-rose-600/80',
      indigo: 'bg-indigo-500 hover:bg-indigo-500/80',
    },
    variant: {
      solid: 'text-white dark:text-foreground shadow-sm',
      soft: '',
      outline: 'ring-1 ring-inset',
      ghost: 'bg-transparent',
    },
    disabled: {
      true: 'pointer-events-none cursor-not-allowed',
    },
    size: {
      sm: 'h-7 px-3 text-xs',
      md: 'h-10 px-4 sm:h-9',
    },
  },
  compoundVariants: [
    // primary
    {
      variant: 'soft',
      color: 'primary',
      class: `
        bg-primary/10 text-primary hover:bg-primary/20
        dark:text-primary dark:bg-primary/20 dark:hover:bg-primary/30
      `,
    },
    {
      variant: 'outline',
      color: 'primary',
      class: `
        ring-primary bg-white text-primary hover:bg-primary/10
        dark:bg-background dark:hover:bg-primary/30
      `,
    },
    {
      variant: 'ghost',
      color: 'primary',
      class: 'text-primary hover:bg-primary/20',
    },

    // emerald
    {
      variant: 'soft',
      color: 'emerald',
      class: `
        bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20
        dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30
      `,
    },
    {
      variant: 'outline',
      color: 'emerald',
      class: `
        ring-emerald-500 bg-white text-emerald-500 hover:bg-emerald-500/10
        dark:bg-background dark:hover:bg-emerald-500/30
      `,
    },
    {
      variant: 'ghost',
      color: 'emerald',
      class: 'text-emerald-500 hover:bg-emerald-500/20',
    },

    // amber
    {
      variant: 'soft',
      color: 'amber',
      class: `
        bg-amber-600/10 text-amber-600 hover:bg-amber-600/20
        dark:bg-amber-600/20 dark:hover:bg-amber-600/30
      `,
    },
    {
      variant: 'outline',
      color: 'amber',
      class: `
        ring-amber-600 bg-white text-amber-600 hover:bg-amber-600/10
        dark:bg-background dark:hover:bg-amber-600/30
      `,
    },
    {
      variant: 'ghost',
      color: 'amber',
      class: 'text-amber-600 hover:bg-amber-600/20',
    },

    // rose
    {
      variant: 'soft',
      color: 'rose',
      class: `
        bg-rose-600/10 text-rose-600 hover:bg-rose-600/20
        dark:bg-rose-600/20 dark:hover:bg-rose-600/30
      `,
    },
    {
      variant: 'outline',
      color: 'rose',
      class: `
        ring-rose-600 bg-white text-rose-600 hover:bg-rose-600/10
        dark:bg-background dark:hover:bg-rose-600/30
      `,
    },
    {
      variant: 'ghost',
      color: 'rose',
      class: 'text-rose-600 hover:bg-rose-600/20',
    },

    // indigo
    {
      variant: 'soft',
      color: 'indigo',
      class: `
        bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20
        dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30
      `,
    },
    {
      variant: 'outline',
      color: 'indigo',
      class: `
        ring-indigo-500 bg-white text-indigo-500 hover:bg-indigo-500/10
        dark:bg-background dark:hover:bg-indigo-500/30
      `,
    },
    {
      variant: 'ghost',
      color: 'indigo',
      class: 'text-indigo-500 hover:bg-indigo-500/20',
    },

    // disabled
    {
      variant: 'solid',
      color: 'primary',
      disabled: true,
      class: 'bg-primary/50',
    },
    {
      variant: 'solid',
      color: 'emerald',
      disabled: true,
      class: 'bg-emerald-500/50',
    },
    {
      variant: 'solid',
      color: 'rose',
      disabled: true,
      class: 'bg-rose-500/50',
    },
    {
      variant: 'solid',
      color: 'amber',
      disabled: true,
      class: 'bg-amber-500/50',
    },
    {
      variant: 'solid',
      color: 'indigo',
      disabled: true,
      class: 'bg-indigo-500/50',
    },
  ],
  defaultVariants: {
    variant: 'solid',
    color: 'primary',
    size: 'md',
  },
})
</script>

<template>
  <button
    :class="button({
      variant, color, size,
      disabled: props.loading || props.disabled,
      class: props.class,
    })"
    :disabled="props.loading || props.disabled"
  >
    <Icon icon="lucide:loader" v-if="props.loading" class="animate-spin" />
    <template v-else>
      <Component v-if="props.icon" :is="props.icon" />
      <slot>{{ label }}</slot>
    </template>
  </button>
</template>
