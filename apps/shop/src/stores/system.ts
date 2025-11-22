import { defineStore } from "pinia"
import { useStorage } from "@vueuse/core"

import type { ThemeType, LocaleType } from "@/inters/shop"
import i18n from "@/locales"

export const useSystemStore = defineStore('system', () => {
  const locale = useStorage<LocaleType>('locale', 'zh', localStorage)
  const theme = useStorage<ThemeType>('theme', 'light', localStorage)
  const isDark = theme.value === 'dark'

  function setLocale(lang: LocaleType) {
    locale.value = lang
    i18n.global.locale = locale.value
  }

  function toggleTheme() {
    const isDark = theme.value === 'dark'
    const html = document.documentElement
    html.classList.remove(theme.value)
    theme.value = isDark ? 'light' : 'dark'
    html.classList.add(theme.value)
  }

  return {
    locale,
    theme,
    isDark,

    setLocale,
    toggleTheme,
  }
})