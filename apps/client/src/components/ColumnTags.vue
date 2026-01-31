<script setup lang="ts">
import { tv } from 'tailwind-variants'

interface ColumnTagProps {
  label: string,
  checked: boolean,
}

interface ColumnTagEmits {
  (e: "click", label: string): void
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
  <button :class="b.base({ checked })" @click="emits('click', label)">{{ label }}</button>
</template>
