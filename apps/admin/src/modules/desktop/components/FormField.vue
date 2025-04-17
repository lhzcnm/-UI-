<script setup lang="ts">
import { twJoin } from 'tailwind-merge'

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
</script>

<template>
  <div
    :class="twJoin(
      'flex space-x-1 py-4 first:pt-0 last:pb-0 border-dashed',
      variant === 'vertical' && 'flex-col space-y-2',
    )"
  >
    <div class="flex-1">
      <p
        :class="twJoin(
          'text-base font-semibold',
          required && 'before:content-[\'*\'] before:text-rose-500 before:text-sm'
        )"
      >
        {{ label }}
      </p>
      <span
        v-if="variant === 'horizontal'"
        class="text-sm text-muted-foreground"
      >
        {{ description }}
      </span>
    </div>
    <div :class="twJoin(contentFlex && 'flex-1')">
      <slot />
    </div>
  </div>
</template>
