import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { ua } from '@3un/utils'
import i18n from '@/locales'

export const useSystemStore = defineStore('system', () => {
  const showSidebar = useStorage<boolean>('show-sidebar', ua.isDesktop)
  const locale = useStorage<string>('locale', '', localStorage)
  
  function setLocale(lang: string) {
    locale.value = lang
    i18n.global.locale.value = locale.value
  }

  return {
    showSidebar,
    locale,

    setLocale,
  }
})
