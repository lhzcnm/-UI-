<script setup lang="ts">
import { useSystemStore } from '@/stores/system'
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

const uStore = useUserStore()
const systemStore = useSystemStore()

const foldIcon = computed(() => {
  if(systemStore.showSidebar) return 'lucide:panel-left-close'
  return 'lucide:panel-left-open'
})
</script>

<template>
  <header class="w-full h-header px-4 bg-background">
    <div class="flex items-center justify-between h-full border-b border-dashed">
      <div class="flex items-center">
        <TheLogo />
        <Icon class="ml-16 text-zinc-500 cursor-pointer" width="24" :icon="foldIcon" @click="systemStore.toggleSidebar" />
      </div>
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

        <LanguageSwitch />
        <TheTheme />
        <TheAvatar class="size-8" />
      </nav>
    </div>
  </header>
</template>
