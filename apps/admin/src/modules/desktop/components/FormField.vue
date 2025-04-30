<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

interface FormFieldProps {
  label: string
  description: string
  required?: boolean
  contentFlex?: boolean
  variant?: 'vertical' | 'horizontal'
}

withDefaults(
  defineProps<FormFieldProps>(),
  {
    required: false,
    description: '',
    contentFlex: true,
    variant: 'horizontal'
  }
)

const style = tv({
  slots: {
    base: 'flex py-4 first:pt-0 last:pb-0 border-dashed',
    title: 'text-base font-semibold',
    desc: 'text-sm text-muted-foreground',
  },
  variants: {
    variant: {
      vertical: {
        base: 'flex-col space-y-2'
      },
      horizontal: {
        base: 'space-x-1'
      }
    },
    required: {
      true: {
        title: 'before:content-[\'*\'] before:text-rose-500 before:text-sm'
      }
    }
  }
})

const b = style()
</script>

<template>
  <div :class="b.base({ variant })">
    <div class="flex-1">
      <p :class="b.title({ required })">{{ label }}</p>
      <span
        v-if="variant === 'horizontal'"
        :class="b.desc()"
      >
        {{ description }}
      </span>
    </div>
    <div :class="twJoin(contentFlex && 'flex-1')">
      <slot />
    </div>
  </div>
</template>
