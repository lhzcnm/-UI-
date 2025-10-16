<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

function doRefresh() {
  location.reload()
}
</script>

<template>
  <button
    accesskey="t"
    :class="twMerge(
      'p-2 rounded-full text-muted-foreground transition-colors duration-300',
      'bg-muted hover:bg-accent/20',
    )"
    aria-label="Refresh Button"
    @click="doRefresh"
  >
    <Icon icon="lucide:refresh-cw" class="size-5" />
    <!-- <span>刷新</span> -->
  </button>
</template>
