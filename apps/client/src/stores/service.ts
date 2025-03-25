import type { ServiceDetail, Service } from '@/api/services'

import { defineStore } from 'pinia'
import { serviceApi } from '@/api/services'
import { useFetchWithCache } from '@3un/utils'

export const useServiceStore = defineStore('serviceStore', () => {
  const sKey = import.meta.env.VITE_SERVICES
  const rKey = import.meta.env.VITE_RECENT_SERVICES

  const details = shallowRef<ServiceDetail[]>([])
  const services = shallowRef<Map<number, Service>>(new Map())

  async function getServices() {
    const _details = await useFetchWithCache({
      fetchData: serviceApi.list, key: sKey
    })

    services.value.clear()
    for (const item of _details) {
      for (const service of item.children) {
        services.value.set(service.id, service)
      }
    }

    details.value = _details
  }

  function addRecentService(id: number) {
    const rawList = localStorage.getItem(rKey)
    const list = rawList ? JSON.parse(rawList) as number[] : []

    if (!list.includes(id)) {
      list.unshift(id)
    }

    const validList = list.filter((item) => services.value.has(item))
    const maxLength = 5

    if (validList.length > maxLength) {
      validList.pop()
    }

    localStorage.setItem(rKey, JSON.stringify(validList))
  }

  return {
    services,
    details,
    getServices,
    addRecentService,
  }
})
