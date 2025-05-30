import type { Setting } from '@/api/settings'

import { defineStore } from 'pinia'
import { settingApi } from '@/api/settings'
import { useFetchWithCache } from '@3un/utils'
import { useStorage } from '@vueuse/core'

export const useSettingStore = defineStore('settingStore', () => {
  const key = import.meta.env.VITE_SETTINGS
  const settings = useStorage<Setting>(key, {} as Setting, sessionStorage)
  const originUrl = ref('')

  async function getSettings() {
    const data = await useFetchWithCache({
      fetchData: async () => (await settingApi.get()).data,
      key,
    })

    settings.value = data
  }

  return {
    settings,
    originUrl,
    getSettings,
  }
})
