<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

function goToInstruction() {
  window.open('http://docx.3unlocked.com/#/', '_blank')
}
</script>

<template>
  <header :class="twJoin(
    'w-full h-mobile-header px-3 bg-card',
    'border-b dark:border-white/5',
    'shadow-sm dark:shadow-md dark:shadow-white/5'
  )">
    <div class="flex items-center justify-between h-mobile-header">
      <TheLogo size="1.75rem" />

      <nav class="flex items-center space-x-3">
        <LanguageSwitch />
        <TheTheme />
        <FreshButton />
        <button @click="goToInstruction()" class="bg-muted text-muted-foreground p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Icon icon="mdi:help-circle-outline" class="size-5"/>
        </button>
        <TheAvatar class="size-8" />
      </nav>
    </div>
  </header>
</template>
