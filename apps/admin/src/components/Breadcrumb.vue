<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

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
        v-if="index === lastIndex"
        class="px-1.5 py-0.5 font-medium"
      >
        {{ item }}
      </span>
      <span
        v-else
        :class="twJoin(
          'px-1.5 py-0.5 text-muted-foreground rounded-md transition-colors',
          'hover:text-foreground hover:bg-muted cursor-pointer',
        )"
      >
        {{ item }}
      </span>
    </template>
  </div>
</template>
