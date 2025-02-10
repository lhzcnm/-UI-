<script setup lang="ts">
import type { XSelectGroupProps } from './select'

defineOptions({ name: 'XSelectGroup' })
defineProps<XSelectGroupProps>()
</script>

<template>
  <div class="flex flex-col gap-1 mt-3 first:mt-0">
    <span class="ml-2 text-sm font-semibold text-muted-foreground">{{ title }}</span>
    <slot />
  </div>
</template>
