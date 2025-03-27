import type { BreadcrumbItem } from '@/types'
import { defineStore } from 'pinia'

export const useSystemStore = defineStore('systemStore', () => {
  const breadcrumbItems = ref<BreadcrumbItem[]>([])

  return {
    breadcrumbItems,
  }
})
