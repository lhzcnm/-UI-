<script setup lang="ts">
import { Icon } from '@iconify/vue'

const iStore = useSystemStore()
</script>

<template>
  <header class="flex items-center justify-between h-header px-2 border-b">
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
        accesskey="m"
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
      >
        <Icon icon="lucide:bell" class="size-5" />
      </button>

      <TheTheme ghost />
  
      <button
        accesskey="s"
        class="p-2 rounded-full hover:bg-muted text-muted-foreground"
      >
        <Icon icon="lucide:settings" class="size-5" />
      </button>
    </div>
  </header>
</template>
