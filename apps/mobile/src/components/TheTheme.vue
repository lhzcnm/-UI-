<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { THEME } from '@3un/shared'

const theme = inject(THEME)!
const html = document.documentElement

const toggleTheme = () => {
  theme.value.isDark = !theme.value.isDark
  const target = theme.value.isDark ? 'dark' : 'light'

  localStorage.setItem('3un-theme', target)
  html.setAttribute('data-ag-theme-mode', target)
  html.className = html.className.replace(theme.value.name, target)
  theme.value.name = target
}
</script>

<template>
  <button
    class="p-2 rounded-full bg-muted text-muted-foreground"
    aria-label="Toggle theme"
    @click="toggleTheme"
  >
    <Icon icon="hugeicons:moon-02" v-if="theme.isDark" class="size-5" />
    <Icon icon="hugeicons:sun-03" v-else class="size-5" />
  </button>
</template>
