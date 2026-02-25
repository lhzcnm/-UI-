import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ua } from '@3un/utils'

import type { OrderBatchEditItem } from '@/inters/orders'
import { getTodoCount } from '@/api/dashboard'
import { getConfigs, getSettings, getThread } from '@/api/settings'
import type { Configs } from '@/inters/settings'

export const useSystemStore = defineStore('system', () => {
  let todoTimer: ReturnType<typeof setInterval> | null = null

  const showSidebar = useStorage<boolean>('show-sidebar', ua.isDesktop)
  const showSetting = ref(false)

  const breadcrumbItems = ref<string[]>([])
  const selectedOrders = ref<OrderBatchEditItem[]>([])
  const settings = ref<Record<string, any>>({})
  const configs = ref<Configs>({} as Configs)

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

    todoTimer = setInterval(getTodoMsg, 30000)
    getTodoMsg()
  }

  function stopTodoTimer() {
    if (todoTimer) {
      clearInterval(todoTimer)
      todoTimer = null
    }
  }

  async function getSetting() {
    const data = await getSettings()

    for (const item of data) {
      if (item.content) {
        settings.value[item.name] = item.content
        continue
      }
      if (item.status) {
        settings.value[item.name] = item.status
      }
    }
  }

  async function getConfig() {
    const data = await getConfigs()
    configs.value = data.reduce((acc, cur) => {
      acc[cur.key as keyof Configs] = cur.value
      return acc
    }, {} as Configs)
  }

  async function getThreads() {
    const data = await getThread()
    settings.value['threads'] = data
  }

  return {
    showSidebar,
    showSetting,
    todoCount,
    breadcrumbItems,
    selectedOrders,
    settings,
    configs,
    toggleSidebar,
    getTodoMsg,
    startTodoTimer,
    stopTodoTimer,
    getSetting,
    getThreads,
    getConfig,
  }
})
