<script setup lang="ts">
import { type Theme } from '@3un/shared'
import { Toaster } from 'vue-sonner'

const html = document.documentElement
const isDark = html.classList.contains('dark')
const theme = ref<Theme>({
  name: isDark ? 'dark' : 'light',
  isDark: isDark,
})
</script>

<template>
  <div class="w-screen h-screen bg-background">
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </template>
    </RouterView>
    
    <TheConfirm />

    <Toaster
      rich-colors
      position="top-center"
      :theme="theme.name"
    />
  </div>
</template>
