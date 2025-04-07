import { defineStore } from 'pinia'
import { ua } from '@3un/utils'

export const useSystemStore = defineStore('systemStore', () => {
  const breadcrumbItems = ref<string[]>([])
  const showSidebar = ref(ua.isDesktop)

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value
  }

  return {
    showSidebar,
    breadcrumbItems,
    toggleSidebar,
  }
})
