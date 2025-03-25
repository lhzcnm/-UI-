<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface BackHeaderProps {
  title: string
}

defineProps<BackHeaderProps>()
</script>

<template>
  <section class="relative flex items-center h-mobile-header border-b bg-card">
    <button
      class="inline-flex items-center ml-3 text-secondary-foreground"
      @click="$router.back()"
    >
      <Icon icon="lucide:chevron-left" class="size-7" />
    </button>
    <h2 class="absolute left-1/2 -translate-x-1/2 text-xl">{{ title }}</h2>
    <slot><span /></slot>
  </section>
</template>
