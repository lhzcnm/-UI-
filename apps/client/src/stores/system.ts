import i18n from '@/locales'
import { ua } from '@3un/utils'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', () => {
  const showSidebar = useStorage<boolean>('show-sidebar', ua.isDesktop)
  const locale = useStorage<string>('locale', '', localStorage)
  const fromRoute = ref<string>('')

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value
  }

  function setLocale(lang: string) {
    locale.value = lang
    i18n.global.locale.value = locale.value
  }

  function setFromRoute(route: string) {
    fromRoute.value = route
  }

  return {
    showSidebar,
    locale,
    fromRoute,

    toggleSidebar,
    setLocale,
    setFromRoute,
  }
})