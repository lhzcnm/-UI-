import type { ServiceGroup, Service, ServiceDetail } from '@3un/shared/services'

import { defineStore } from 'pinia'
import { useFetchWithCache } from '@3un/utils'
import serviceApi from '@/api/service'

export const useServiceStore = defineStore('serviceStore', () => {
  const sKey = import.meta.env.VITE_SERVICES
  const gKey = import.meta.env.VITE_GROUPS

  const services = shallowRef<Service[]>([])
  const groups = shallowRef<ServiceGroup[]>([])
  const buckets = shallowRef<Map<number, Service>>(new Map())
  const serviceDetails = shallowRef<ServiceDetail[]>([])

  async function getServices() {
    const [_services, _groups] = await Promise.all([
      useFetchWithCache({ fetchData: serviceApi.list, key: sKey }),
      useFetchWithCache({ fetchData: serviceApi.groupList, key: gKey }),
    ])

    buckets.value.clear()
    for (const item of _services) {
      buckets.value.set(item.id, item)
    }

    groups.value = _groups
    services.value = _services
    buildServiceDetails(_services, _groups)
  }

  function buildServiceDetails(services: Service[], groups: ServiceGroup[]) {
    const result: ServiceDetail[] = []

    for (const group of groups) {
      const children: Service[] = []

      for (const service of services) {
        if (service.groupId === group.id) {
          children.push(service)
        }
      }

      if (children.length) {
        result.push({
          ...group,
          children,
        })
      }
    }

    serviceDetails.value = result
  }

  return {
    groups,
    services,
    serviceDetails,
    buckets,
    getServices,
  }
})
