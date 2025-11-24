<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { tv } from 'tailwind-variants'
import { TOOL_STORE, ToolStatus } from '@desktop/utils'

interface TheGlobalBackProps {
  name: string
}

defineProps<TheGlobalBackProps>()

const store = inject(TOOL_STORE)!

const style = tv({
  base: [
    'h-16 w-full pl-2 pr-4 flex items-center justify-start gap-3',
    'border-b border-zinc-200 dark:border-zinc-800',
    'bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md',
    'sticky top-0 z-20 shadow-sm',
    'transition-all duration-200'
  ]
})

function handleClick() {
  store.toolStatus = ToolStatus.ROOT
}
</script>

<template>
  <button
    :class="style()"
    @click="handleClick"
    class="group select-none"
  >
    <Icon
      icon="lucide:chevron-left"
      class="size-10 text-zinc-700 dark:text-zinc-200 transition-transform group-hover:-translate-x-1"
    />
    <span class="text-2xl font-medium text-zinc-800 dark:text-zinc-100">
      {{ name }}
    </span>
  </button>
</template>
