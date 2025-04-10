<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

import type { ServiceView } from '@/interface/services'

interface RouteSearchItemProps {
  child: ServiceView
}

defineProps<RouteSearchItemProps>()
</script>

<template>
  <li>
    <button
      :class="twJoin(
        'flex justify-between space-x-2 w-full rounded-md p-1.5 text-left group',
        'focus:bg-muted dark:focus:bg-accent/50 focus:outline-none',
        'hover:bg-muted dark:hover:bg-accent/50',
      )"
    >
      <div class="flex items-center space-x-2 overflow-hidden">
        <Icon icon="lucide:package" class="size-4" />
        <p class="truncate">{{ child.packageId }} - {{ child.packageTitle }}</p>
      </div>
      <span
        :class="twJoin(
          'opacity-0 text-muted-foreground whitespace-nowrap',
          'group-hover:opacity-100 group-focus:opacity-100',
        )"
      >
        查看
      </span>
    </button>
  </li>
</template>
