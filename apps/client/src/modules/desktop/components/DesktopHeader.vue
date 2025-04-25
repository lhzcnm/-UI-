<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

const uStore = useUserStore()
</script>

<template>
  <header class="w-full h-header px-4 bg-background">
    <div class="flex items-center justify-between h-full border-b border-dashed">
      <TheLogo />

      <nav class="flex items-center space-x-4">
        <RouterLink
          to="/recharge"
          :class="twJoin(
            'flex items-center space-x-2 px-3 py-2 shadow',
            'bg-success text-white rounded-full'
          )"
        >
          <Icon icon="hugeicons:bitcoin-bag" class="size-5" />
          <span class="text-sm">{{ uStore.info.credits }}</span>
        </RouterLink>

        <TheTheme />
        <TheAvatar class="size-8" />
      </nav>
    </div>
  </header>
</template>
