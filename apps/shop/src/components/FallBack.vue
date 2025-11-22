<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
</script>

<template>
  <div
    :class="twJoin(
      'flex items-center justify-center flex-col',
      'h-[50vh] text-6xl text-muted-foreground',
    )"
  >
    <Icon icon="svg-spinners:pulse-3" />
    <span class="text-base mt-3">loading...</span>
  </div>
</template>
