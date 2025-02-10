<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { THEME } from '@3un/shared'
import type { Theme } from '@3un/shared'

const html = document.documentElement
const isDark = html.classList.contains('dark')
const theme = ref<Theme>({
  name: isDark ? 'dark' : 'light',
  isDark: isDark,
})

provide(THEME, theme)
</script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component" />
      </Suspense>
    </template>
  </RouterView>
  <Toaster
    richColors
    position="top-center"
    :theme="theme.name"
  />
</template>
