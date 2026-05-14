<script setup lang="ts">
import type { TemplateType } from '@/types'
import { tv } from 'tailwind-variants'

interface ColumnTagProps {
  id: string,
  label: string,
  type?: TemplateType,
  checked: boolean,
}

interface ColumnTagEmits {
  (e: "click", id: string, type?: TemplateType): void
}

defineProps<ColumnTagProps>()
const emits = defineEmits<ColumnTagEmits>()

const style = tv({
  slots: {
    base: "border borfer-border py-1 px-2 rounded transition-all"
  },
  variants: {
    checked: {
      true: "border-primary"
    }
  }
})

const b = style()
</script>

<template>
  <button :class="b.base({ checked })" @click="emits('click', id, type)">{{ label }}</button>
</template>
