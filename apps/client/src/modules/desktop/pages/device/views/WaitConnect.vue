<script setup lang="ts">
import { Icon } from '@iconify/vue'

const localStore = useLocalStore()
</script>

<template>
  <div class="flex items-center justify-center flex-col h-full bg-background">
    <div class="relative -mt-36">
      <div class="absolute inset-0 animate-pulse bg-primary/10 rounded-full blur-xl"></div>
      <div class="relative border-2 border-dashed border-primary/30 rounded-full p-6 bg-background/50 backdrop-blur-sm">
        <Icon icon="lucide:unlink" class="text-7xl text-primary x-animate-bounce" />
      </div>
    </div>
    <div class="mt-12 text-center space-y-4">
      <h2 class="text-2xl font-semibold text-foreground">{{ localStore.localData['device_WaitingConnection'] }}</h2>
      <p class="text-base text-muted-foreground max-w-md">
        {{ localStore.localData['device_PluginWaitText'] }}
      </p>
    </div>
  </div>
</template>
