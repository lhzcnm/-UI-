import type { ServiceGroupView, ServiceView } from '@/interface/services'
import { useFetchWithCache } from '@3un/utils'
import { serviceApi } from '@/api/services'
import { defineStore } from 'pinia'

export const useServiceStore = defineStore('serviceStore', () => {
  const GROUP_KEY = import.meta.env.VITE_SERVICE_GROUPS
  const ITEM_KEY = import.meta.env.VITE_SERVICE_ITEMS

  const titles = ref<Map<number, string>>(new Map())
  const groups = ref<ServiceGroupView[]>([])
  const items = ref<ServiceView[]>([])

  function updateTitles(data: ServiceView[]) {
    titles.value.clear()

    data.forEach(item => titles.value.set(
      item.packageId,
      item.packageTitle
    ))
  }

  async function getItems(force = false) {
    const data = await useFetchWithCache({
      fetchData: serviceApi.items,
      key: ITEM_KEY,
      force,
    })

    updateTitles(data)
    items.value = data.map(item => serviceApi.convertModel(item))
  }

  async function getGroups(force = false) {
    const data = await useFetchWithCache({
      fetchData: serviceApi.groups,
      key: GROUP_KEY,
      force,
    })

    groups.value = data.map(item => serviceApi.convertGroupModel(item))
  }

  return {
    titles,
    groups,
    items,

    getItems,
    getGroups,
  }
})
