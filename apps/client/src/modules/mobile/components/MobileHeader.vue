<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twJoin } from 'tailwind-merge'

const { t, locale } = useI18n()

const isEn = computed(() => locale.value === 'en')

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
        <button
          @click="goToInstruction()"
          class="text-[12px] flex items-center justify-center w-8 h-8 text-primary border-border"
          :class="{ 'border rounded-full': !isEn }"
        >
          <Icon v-if="isEn" icon="lucide:circle-question-mark" class="size-full" />

          <span v-else>{{ t('illustrate-mobile') }}</span>
        </button>
        <TheAvatar class="size-8" />
      </nav>
    </div>
  </header>
</template>
