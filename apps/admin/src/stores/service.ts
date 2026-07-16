import type { Service, ServiceDetail, ServiceGroup } from '@/inters/services'
import { getServiceGroups, getServices } from '@/api/services'

import { useFetchWithCache } from '@3un/utils'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useServiceStore = defineStore('service', () => {
  const groups = useStorage<ServiceGroup[]>('groups', [], sessionStorage)
  const items = useStorage<Service[]>('services', [], sessionStorage)

  const groupMap = ref(new Map<number, ServiceGroup>())
  const itemMap = ref(new Map<number, Service>())

  const details = computed(() => {
    const list: ServiceDetail[] = []
    for (const group of groups.value) {
      const children: Service[] = []
      
      for (const item of items.value) {
        if (item.categoryId === group.categoryId) {
          children.push(item)
        }
      }

      if (children.length) {
        list.push({ ...group, children })
      }
    }

    return list
  })

  async function getItems(force = false) {
    const data = await useFetchWithCache({
      fetchFn: getServices,
      key: 'services',
      force: force,
    })

    itemMap.value.clear()
    itemMap.value = new Map(data
      .map(item => [item.packageId, item]))

    items.value = data
  }

  async function getGroups(force = false) {
    const data = await useFetchWithCache({
      fetchFn: getServiceGroups,
      key: 'groups',
      force: force,
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
    details,
    getItems,
    getGroups,
  }
})
