import type { ServiceDetail, Service } from '@/api/services'

import { defineStore } from 'pinia'
import { useFetchWithCache } from '@3un/utils'

import { serviceApi } from '@/api/services'

export const useServiceStore = defineStore('serviceStore', () => {
  /** 文件导入数据弹窗数据类型选择 */
  const importFile = ref<File>()
  const details = shallowRef<ServiceDetail[]>([])
  const services = shallowRef<Map<number, Service>>(new Map())

  async function getServices() {
    const locale = localStorage.getItem('locale') ?? 'zh'

    const data = await useFetchWithCache({
      fetchFn: async () => (await serviceApi.list()).data,
      key: `${import.meta.env.VITE_SERVICES}_${locale}`,
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
    importFile,
    services,
    details,
    getServices,
    addRecentService,
  }
})
