import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ua } from '@3un/utils'

import type { OrderBatchEditItem } from '@/inters/orders'

export const useSystemStore = defineStore('system', () => {
  const showSidebar = useStorage<boolean>('show-sidebar', ua.isDesktop)
  const breadcrumbItems = ref<string[]>([])
  const isGlobalSearch = ref<boolean>(false)

  const selectedOrders = ref<OrderBatchEditItem[]>([])
  const richText = ref<string>('')

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value
  }

  return {
    showSidebar,
    breadcrumbItems,
    isGlobalSearch,
    selectedOrders,
    richText,
    toggleSidebar,
  }
})
