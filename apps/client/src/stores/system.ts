import { ua } from '@3un/utils'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useSystemStore = defineStore('system', () => {
  const showSidebar = useStorage<boolean>('show-sidebar', ua.isDesktop)

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value
  }

  return {
    showSidebar,
    toggleSidebar,
  }
})