<script setup lang="ts">
import type { ClassNameValue } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

interface ServiceGroupSelProps {
  id: number,
  name: string,
  class?: ClassNameValue,
}

const props = defineProps<ServiceGroupSelProps>()

const groupId = defineModel<number>({  })

const style = tv({
  slots: {
    root: [
      'transition-all duration-200 select-none font-medium',
      'px-4 py-2 rounded-full border',
      'bg-zinc-100 dark:bg-zinc-900',
      'hover:bg-zinc-200 dark:hover:bg-zinc-800',
      'active:scale-95',
      'focus:outline-none focus:ring-2 focus:ring-primary/50',
    ],
  }
})

const b = style()
</script>

<template>
  <button
    :class="b.root({class: props.class})"
    @click="groupId = props.id">
    {{ name }}
  </button>
</template>
