<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'

const uStore = useUserStore()

const avatar = computed(() => {
  if (uStore.info.avatar) return uStore.info.avatar
  return '/images/default_avatar.jpg'
})
</script>

<template>
  <header class="fixed top-0 z-50 w-full h-header px-4 bg-background">
    <div class="flex items-center justify-between h-full border-b border-dashed">
      <TheLogo />

      <nav class="flex items-center gap-4">
        <RouterLink
          to="/recharge"
          :class="twMerge(
            'flex items-center gap-2 px-3 py-2 shadow',
            'bg-success text-success-foreground rounded-full'
          )"
        >
          <Icon icon="hugeicons:bitcoin-bag" class="size-5" />
          <span class="text-sm">{{ uStore.info.credits }}</span>
        </RouterLink>

        <TheTheme />
        <img
          :src="avatar" alt="avatar" draggable="false"
          class="size-8 border rounded-full"
        >
      </nav>
    </div>
  </header>
</template>
