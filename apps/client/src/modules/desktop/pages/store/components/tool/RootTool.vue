<script setup lang="ts">
import ThemeTool from './ThemeTool.vue'
import TimeDisplay from './TimeDisplay.vue'
import LanuageTool from './LanuageTool.vue'

import { tv } from 'tailwind-variants'
import ServiceGroupTool from './ServiceGroupTool.vue'

const style = tv({
  base: [
    'flex flex-col items-center justify-center gap-1',
    'w-28 h-28 rounded-2xl shadow-lg border transition-all duration-300',
    'cursor-pointer select-none',
    'hover:scale-105 active:scale-95',
    'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700',
    'text-zinc-700 dark:text-zinc-200'
  ],
})
</script>

<template>
  <div class="flex-1 flex flex-col">
    <div class="mt-4 w-full flex flex-col space-y-2 items-center">
      <TheLogo size="36" />
      <!-- <TimeDisplay /> -->
    </div>

    <div class="grid grid-cols-4 p-4 overflow-y-auto gap-x-2 gap-y-2" style="scrollbar-width: none;">
      <ThemeTool :class="style()" />
      <LanuageTool :class="style()" />
      <ServiceGroupTool :class="style()" />
    </div>
  </div>
</template>
