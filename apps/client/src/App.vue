<script setup lang="ts">
import { Toaster } from 'vue-sonner'

import type { Theme } from '@3un/shared'
import { THEME } from '@3un/utils'

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
    <Suspense>
      <component :is="Component" v-if="Component" />

      <template #fallback>
        <Fallback />
      </template>
    </Suspense>

  </RouterView>
  <TheConfirm />
  <Toaster richColors position="top-center" :theme="theme.name" />
</template>
