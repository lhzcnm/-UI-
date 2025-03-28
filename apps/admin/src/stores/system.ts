import type { BreadcrumbItem } from '@/types'
import { defineStore } from 'pinia'

export const useSystemStore = defineStore('systemStore', () => {
  const breadcrumbItems = ref<BreadcrumbItem[]>([])
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
