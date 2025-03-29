<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import type { SidebarMenuChild } from '@/utils/sidebar'

interface RouteSearchItemProps {
  child: SidebarMenuChild
}

defineProps<RouteSearchItemProps>()
</script>

<template>
  <li>
    <button
      :class="twJoin(
        'flex justify-between w-full rounded-md p-1.5 group',
        'focus:bg-muted dark:focus:bg-accent/50 focus:outline-none',
        'hover:bg-muted dark:hover:bg-accent/50',
      )"
    >
      <div class="flex items-center space-x-2">
        <Icon :icon="child.icon!" class="size-4" />
        <span>{{ child.label }}</span>
      </div>
      <span
        :class="twJoin(
          'opacity-0 text-muted-foreground',
          'group-hover:opacity-100 group-focus:opacity-100',
        )"
      >
        前往
      </span>
    </button>
  </li>
</template>
