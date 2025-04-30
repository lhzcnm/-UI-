import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ua } from '@3un/utils'

export const useSystemStore = defineStore('system', () => {
  const showSidebar = useStorage<boolean>('show-sidebar', ua.isDesktop)
  const breadcrumbItems = ref<string[]>([])

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value
  }

  return {
    showSidebar,
    breadcrumbItems,
    toggleSidebar,
  }
})
