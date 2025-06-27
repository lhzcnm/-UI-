<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { twMerge } from 'tailwind-merge'
import { THEME } from '@3un/utils'

interface ThemeProps {
  ghost?: boolean
}

const props = defineProps<ThemeProps>()

const theme = inject(THEME)!
const html = document.documentElement

const toggleTheme = () => {
  theme.value.isDark = !theme.value.isDark
  const target = theme.value.isDark ? 'dark' : 'light'

  localStorage.setItem('theme', target)
  html.className = html.className.replace(theme.value.name, target)
  theme.value.name = target
}
</script>

<template>
  <button
    :class="twMerge(
      'x-tooltip p-2 rounded-full text-muted-foreground hover:text-foreground transition-colors duration-300',
      props.ghost ? 'bg-transparent hover:bg-muted' : 'bg-muted hover:bg-accent/20',
    )"

    accesskey="t"
    aria-label="Toggle theme"
    @click="toggleTheme"
  >
    <Icon icon="lucide:moon" v-if="theme.isDark" class="size-5" />
    <Icon icon="lucide:sun" v-else class="size-5" />

    <div class="x-tooltip-text top120">
      {{ theme.isDark ? '深色模式' : '明亮模式' }}
    </div>
  </button>
</template>
