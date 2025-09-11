<script setup lang="ts">
import PluginDownload from '../components/PluginDowload.vue'
import { Icon } from '@iconify/vue'

const { t } = useI18n()
</script>

<template>
  <div class="flex items-center justify-center flex-col h-full bg-background">
    <div class="relative -mt-36">
      <div class="absolute inset-0 animate-pulse bg-primary/10 rounded-full blur-xl"></div>
      <div class="relative border-2 border-dashed border-primary/30 rounded-full p-6 bg-background/50 backdrop-blur-sm">
        <Icon icon="lucide:circle-arrow-down" class="text-7xl text-primary x-animate-bounce" />
      </div>
    </div>
    <div class="mt-12 text-center space-y-4">
      <h2 class="text-2xl font-semibold text-foreground">
        {{ t('device.plugin.toLow.title') }}
      </h2>
      <p class="text-base text-muted-foreground max-w-md">
        {{ t('device.plugin.toLow.text') }}
      </p>
      <div class="space-x-4 text-center">
        <PluginDownload />
        <XButton
          variant="soft" icon="lucide:refresh-cw"
          @click="$router.go(0)"
        >
          {{ t('device.button.refresh') }}
        </XButton>
      </div>
    </div>
  </div>
</template>
