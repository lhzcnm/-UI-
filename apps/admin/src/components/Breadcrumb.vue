<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

interface BreadcrumbProps {
  items: string[]
}

const props = defineProps<BreadcrumbProps>()
const lastIndex = computed(() => props.items.length - 1)
</script>

<template>
  <div class="flex items-center h-10">
    <template v-for="(item, index) in items" :key="index">
      <span v-if="index > 0" class="text-muted-foreground/50">
        <Icon icon="lucide:chevron-right" class="size-4" />
      </span>

      <span
        :class="twMerge(
          'px-1.5 py-0.5 font-medium cursor-default text-muted-foreground',
          index === lastIndex && 'text-foreground',
        )"
      >
        {{ item }}
      </span>
    </template>
  </div>
</template>
