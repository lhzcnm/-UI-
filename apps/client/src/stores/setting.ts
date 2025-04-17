import type { Setting } from '@/api/settings'

import { defineStore } from 'pinia'
import { settingApi } from '@/api/settings'
import { useFetchWithCache } from '@3un/utils'

export const useSettingStore = defineStore('settingStore', () => {
  const key = import.meta.env.VITE_SETTINGS
  const settings = ref() as Ref<Setting>
  const originUrl = ref('')

  async function getSettings() {
    const { data } = await useFetchWithCache({
      fetchData: settingApi.get,
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
