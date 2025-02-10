import type { ServiceGroup, ServiceItem } from '@3un/shared/services'

import { defineStore } from 'pinia'
import { useFetchWithCache } from '@3un/utils'
import serviceApi from '@/api/service'

export const useServiceStore = defineStore('serviceStore', () => {
  const sKey = import.meta.env.VITE_SERVICES
  const gKey = import.meta.env.VITE_GROUPS

  const services = shallowRef<ServiceItem[]>([])
  const groups = shallowRef<ServiceGroup[]>([])
  const buckets = shallowRef<Map<number, ServiceItem>>(new Map())

  async function getServices() {
    const data = await useFetchWithCache({
      fetchData: serviceApi.list,
      key: sKey,
    })

    buckets.value.clear()
    for (const item of data) {
      buckets.value.set(item.id, item)
    }

    services.value = data
  }

  async function getServiceGroups() {
    const data = await useFetchWithCache({
      fetchData: serviceApi.groupList,
      key: gKey,
    })

    groups.value = data
  }

  return {
    groups,
    services,
    buckets,
    getServiceGroups,
    getServices,
  }
})
