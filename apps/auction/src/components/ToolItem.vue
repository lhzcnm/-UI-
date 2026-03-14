<script setup lang="ts">
import { tv } from 'tailwind-variants'
import type { ToolItem } from '@/inters/basic/sidebar'
import { Icon } from '@iconify/vue'

interface SideBarItemProps {
  tool: ToolItem
}

const { tool } = defineProps<SideBarItemProps>()

const style = tv({
  slots: {
    wrapper: 'relative group',
    indicator: [
      'absolute left-0 top-1/2 -translate-y-1/2',
      'h-6 w-1 rounded-full bg-primary',
      'opacity-0 scale-y-75 transition-all'
    ],
    base: [
      'flex items-center w-full h-10 px-4 rounded-lg',
      'text-sm font-medium',
      'text-muted-foreground',
      'transition-all duration-200',
      'hover:bg-accent/20 hover:text-foreground',
      'group-hover:translate-x-0.5'
    ],
    icon: 'size-4 shrink-0 transition-colors',
    label: 'ml-3 truncate'
  },
  variants: {
  }
})

const b = style()


</script>

<template>
  <div :class="b.wrapper()">
    <button :class="b.base({ })" @click="tool.command">
      <Icon :icon="tool.icon" :class="b.icon({ })" />
      <span :class="b.label()">
        {{ tool.label }}
      </span>
    </button>
  </div>
</template>
