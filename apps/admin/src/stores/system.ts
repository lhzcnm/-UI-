import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ua } from '@3un/utils'

import type { OrderBatchEditItem } from '@/inters/orders'
import { getTodoCount } from '@/api/dashboard'

export const useSystemStore = defineStore('system', () => {
  let todoTimer: ReturnType<typeof setInterval> | null = null

  const showSidebar = useStorage<boolean>('show-sidebar', ua.isDesktop)
  const showSetting = ref(false)

  const breadcrumbItems = ref<string[]>([])
  const selectedOrders = ref<OrderBatchEditItem[]>([])

  const todoCount = reactive({
    ticket    : 0,
    verifying : 0,
    awaiting  : 0,
    processing: 0,
  })

  function toggleSidebar() {
    showSidebar.value = !showSidebar.value
  }

  async function getTodoMsg() {
    const data = await getTodoCount()
    todoCount.ticket = data.ticket
    todoCount.awaiting = data.awaiting
    todoCount.verifying = data.verifying
    todoCount.processing = data.processing
  }

  function startTodoTimer() {
    if (todoTimer) return

    todoTimer = setInterval(() => getTodoMsg(), 30000)
    getTodoMsg()
  }

  function stopTodoTimer() {
    if (todoTimer) {
      clearInterval(todoTimer)
      todoTimer = null
    }
  }

  return {
    showSidebar,
    showSetting,
    todoCount,
    breadcrumbItems,
    selectedOrders,
    toggleSidebar,
    getTodoMsg,
    startTodoTimer,
    stopTodoTimer,
  }
})
