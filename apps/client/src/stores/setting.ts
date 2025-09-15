import type { Setting } from '@/api/settings'

import { defineStore } from 'pinia'
import { settingApi } from '@/api/settings'
import { useFetchWithCache } from '@3un/utils'

export const useSettingStore = defineStore('settingStore', () => {
  const settings = ref<Setting>({} as Setting)
  const originUrl = ref('')

  async function getSettings() {
    const locale = localStorage.getItem('locale') ?? 'zh'
    
    const data = await useFetchWithCache({
      fetchFn: async () => (await settingApi.get()).data,
      key: `${import.meta.env.VITE_SETTINGS}_${locale}`,
    })

    settings.value = data
  }

  return {
    settings,
    originUrl,
    getSettings,
  }
})
