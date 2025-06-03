import type { ServiceDetail, Service } from '@/api/services'

import { defineStore } from 'pinia'
import { serviceApi } from '@/api/services'
import { useFetchWithCache } from '@3un/utils'

export const useServiceStore = defineStore('serviceStore', () => {
  const details = shallowRef<ServiceDetail[]>([])
  const services = shallowRef<Map<number, Service>>(new Map())

  async function getServices() {
    const data = await useFetchWithCache({
      fetchFn: async () => (await serviceApi.list()).data,
      key: import.meta.env.VITE_SERVICES,
    })

    services.value.clear()
    for (const item of data) {
      for (const service of item.children) {
        services.value.set(service.id, service)
      }
    }

    details.value = data
  }

  function addRecentService(id: number) {
    const key = import.meta.env.VITE_RECENT_SERVICES
    const rawList = localStorage.getItem(key)
    const list = rawList ? JSON.parse(rawList) as number[] : []

    if (!list.includes(id)) {
      list.unshift(id)
    }

    const validList = list.filter((item) => services.value.has(item))
    const maxLength = 5

    if (validList.length > maxLength) {
      validList.pop()
    }

    localStorage.setItem(key, JSON.stringify(validList))
  }

  return {
    services,
    details,
    getServices,
    addRecentService,
  }
})
