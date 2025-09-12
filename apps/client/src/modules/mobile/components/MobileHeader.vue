<script setup lang="ts">
import { twJoin } from 'tailwind-merge'
</script>

<template>
  <header
    :class="twJoin(
      'w-full h-mobile-header px-3 bg-card',
      'border-b dark:border-white/5',
      'shadow-sm dark:shadow-md dark:shadow-white/5'
    )"
  >
    <div class="flex items-center justify-between h-mobile-header">
      <TheLogo size="1.75rem" />

      <nav class="flex items-center space-x-3">
        <LanguageSwitch />
        <TheTheme />
        <TheAvatar class="size-8" />
      </nav>
    </div>
  </header>
</template>
