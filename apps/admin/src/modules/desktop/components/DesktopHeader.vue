<script setup lang="ts">
import Breadcrumb from '@/components/Breadcrumb.vue'
import SearchPlane from './SearchPlane.vue'

import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

interface HeaderProps {
  isFullscreen: boolean
  toggleFullscreen: () => void
}

defineProps<HeaderProps>()

const iStore = useSystemStore()
const visibleSearch = ref(false)
const visibleSetting = ref(false)
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
        accesskey="k"
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
        @click="visibleSearch = true"
      >
        <Icon icon="lucide:search" class="size-5" />
      </button>

      <button
        accesskey="m"
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
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
        accesskey="s"
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
        @click="visibleSetting = true"
      >
        <Icon icon="lucide:settings" class="size-5" />
      </button>
    </div>

    <SearchPlane v-model="visibleSearch" />
    <SettingPlane v-model="visibleSetting" />
  </div>
</template>
