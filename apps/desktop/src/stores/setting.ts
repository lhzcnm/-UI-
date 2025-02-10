import type { Setting } from '@3un/shared/settings'

import { defineStore } from 'pinia'
import { useFetchWithCache } from '@3un/utils'
import settingApi from '@/api/settings'

export const useSettingStore = defineStore('settingStore', () => {
  const key = import.meta.env.VITE_SETTINGS
  const settings = ref() as Ref<Setting>

  async function getSettings() {
    const data = await useFetchWithCache({
      fetchData: settingApi.get,
      key,
    })

    settings.value = data
  }

  return {
    settings,
    getSettings,
  }
})
