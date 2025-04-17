import type { Service, ServiceGroup } from '@/inters/services'
import { getServiceGroups, getServices } from '@/api/services'
import { useFetchWithCache } from '@3un/utils'
import { defineStore } from 'pinia'

export const useServiceStore = defineStore('service', () => {
  const groups = ref<ServiceGroup[]>([])
  const items = ref<Service[]>([])
  const groupMap = ref(new Map<number, ServiceGroup>())
  const itemMap = ref(new Map<number, Service>())

  async function getItems() {
    const data = await useFetchWithCache({
      fetchData: getServices,
      key: 'services',
    })

    itemMap.value.clear()
    itemMap.value = new Map(data
      .map(item => [item.packageId, item]))

    items.value = data
  }

  async function getGroups() {
    const data = await useFetchWithCache({
      fetchData: getServiceGroups,
      key: 'groups',
    })

    groupMap.value.clear()
    groupMap.value = new Map(data
      .map(item => [item.categoryId, item]))

    groups.value = data
  }

  return {
    groups,
    groupMap,
    items,
    itemMap,
    getItems,
    getGroups,
  }
})
