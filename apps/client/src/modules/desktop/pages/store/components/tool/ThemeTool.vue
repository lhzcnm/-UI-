<script setup lang="ts">
import { Icon } from '@iconify/vue'

import { THEME } from '@3un/utils'

import type { ToolGlobalProps } from '@desktop/pages/store/utils/types'

const { t } = useI18n()

interface ThemeToolProps extends ToolGlobalProps {}

const props = defineProps<ThemeToolProps>()

const theme = inject(THEME)!
const html = document.documentElement

function toggleTheme() {
  theme.value.isDark = !theme.value.isDark
  const target = theme.value.isDark ? 'dark' : 'light'

  localStorage.setItem('theme', target)
  html.className = html.className.replace(theme.value.name, target)
  theme.value.name = target
}
</script>

<template>
  <button :class="props.class" @click="toggleTheme()">
    <Icon
      :icon="theme.isDark ? 'openmoji:crescent-moon' : 'openmoji:sun'"
      class="size-10 transition-transform duration-300"
    />
    <span class="text-sm">{{ t('store.tool.name.theme') }}</span>
  </button>
</template>
