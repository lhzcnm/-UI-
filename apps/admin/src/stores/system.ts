import { defineStore } from 'pinia'

export const useSystemStore = defineStore('systemStore', () => {
  const breadcrumbItems = ref<string[]>([])
  const showSidebar = ref(true)

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value
  }

  return {
    showSidebar,
    breadcrumbItems,
    toggleSidebar,
  }
})
