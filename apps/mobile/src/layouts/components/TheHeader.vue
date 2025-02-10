<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

const uStore = useUserStore()
</script>

<template>
  <header>
    <div class="flex items-center justify-between">
      <img src="/images/logo.png" alt="logo" class="w-8 h-8" />
      <nav class="flex items-center gap-2">
        <RouterLink
          v-if="uStore.info.credits"
          to="/recharge"
          :class="twMerge(
            'flex items-center gap-2 px-3 py-2 shadow',
            'bg-success text-success-foreground rounded-full'
          )"
        >
          <Icon icon="hugeicons:bitcoin-bag" class="size-5" />
          <span class="text-sm">{{ uStore.info.credits }}</span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
