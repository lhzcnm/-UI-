<script setup lang="ts">
import { localApi } from '@/api/local';
import type { ServiceDetail } from '@/api/services'
import { twMerge } from 'tailwind-merge'

interface ServiceGroupCardProps {
  group: ServiceDetail
}

defineProps<ServiceGroupCardProps>()

const localStore = useLocalStore()
</script>

<template>
  <a href="javascript:void(0)" :class="twMerge(
    'block p-4 bg-card border dark:hover:border-hover rounded-lg',
    'transition-all duration-300 hover:shadow-lg hover:shadow-primary/5',
  )">
    <div class="space-y-1">
      <h3 class="font-bold break-all whitespace-nowrap truncate">{{ group.title }}</h3>
      <span class="text-sm text-muted-foreground">
        {{ localStore.localeSlotVal('submit_ServiceNum', { '{count}': group.children.length }) }}
      </span>
    </div>
  </a>
</template>
