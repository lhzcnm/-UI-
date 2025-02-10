<script setup lang="ts">
import { twMerge } from 'tailwind-merge'
import type { XPagerEmits, XPagerProps } from './pagination'

defineProps<XPagerProps>()
const emit = defineEmits<XPagerEmits>()
</script>

<template>
  <div class="flex items-center gap-2 text-center leading-7">
    <a
      href="javascript:void(0)"
      class="item min-w-9 h-9 p-1 bg-muted rounded shadow-sm"
      :class="twMerge(isFirstPage && 'bg-primary text-primary-foreground')"
    >1</a>
    <a
      v-if="showBeforeMore"
      href="javascript:void(0)"
      class="min-w-9 h-9 p-1 bg-muted rounded shadow-sm"
      @click="emit('more', 'prev')"
    >...</a>
    <a
      v-for="page in pages" :key="page"
      href="javascript:void(0)"
      class="item min-w-9 h-9 p-1 bg-muted rounded shadow-sm"
      :class="twMerge(page === current && 'bg-primary text-primary-foreground')"
    >{{ page }}</a>
    <a
      v-if="showAfterMore"
      href="javascript:void(0)"
      class="min-w-9 h-9 p-1 bg-muted rounded shadow-sm"
      @click="emit('more', 'next')"
    >...</a>
    <a
      v-if="lastPage > 1"
      href="javascript:void(0)"
      class="item min-w-9 h-9 p-1 bg-muted rounded shadow-sm"
      :class="twMerge(isLastPage && 'bg-primary text-primary-foreground')"
    >{{ lastPage }}</a>
  </div>
</template>
