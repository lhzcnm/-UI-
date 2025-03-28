<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'
import Breadcrumb from '@/components/Breadcrumb.vue'

interface HeaderProps {
  isFullscreen: boolean
  toggleFullscreen: () => void
}

defineProps<HeaderProps>()

const iStore = useSystemStore()
</script>

<template>
  <div
    :class="twJoin(
      'flex justify-between items-center',
      'w-full px-1 h-header border-b',
    )"
  >
    <div class="flex items-center space-x-1">
      <button
        class="p-2 rounded-full hover:bg-muted text-muted-foreground transition-transform"
        @click="iStore.toggleSidebar"
        accesskey="b"
      >
        <Icon :icon="iStore.showSidebar ? 'lucide:panel-left-close' : 'lucide:panel-left-open'" class="size-5" />
      </button>

      <Breadcrumb :items="iStore.breadcrumbItems" />
    </div>

    <div class="flex items-center space-x-1">
      <button
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
        accesskey="k"
      >
        <Icon icon="lucide:search" class="size-5" />
      </button>

      <button
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
        accesskey="m"
      >
        <Icon icon="lucide:bell" class="size-5" />
      </button>

      <hr class="h-6 w-px bg-border" />
      <TheTheme ghost />

      <button
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
        @click="toggleFullscreen"
      >
        <Icon
          :icon="isFullscreen ? 'lucide:minimize' : 'lucide:maximize'"
          class="size-5"
        />
      </button>

      <hr class="h-6 w-px bg-border" />
      <button
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
        accesskey="s"
      >
        <Icon icon="lucide:settings" class="size-5" />
      </button>
    </div>
  </div>
</template>
