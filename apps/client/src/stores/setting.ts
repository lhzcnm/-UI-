import type { HandleFeeType, Setting } from '@/api/settings'

import { defineStore } from 'pinia'
import { settingApi } from '@/api/settings'
import { useFetchWithCache } from '@3un/utils'
import { rechargeApi } from '@/api/recharge'

export const useSettingStore = defineStore('settingStore', () => {
  const settings = ref<Setting>({} as Setting)
  const handleFee = ref<HandleFeeType>({} as HandleFeeType)
  const originUrl = ref('')

  async function getSettings() {
    const locale = localStorage.getItem('locale') ?? 'zh'
    
    const data = await useFetchWithCache({
      fetchFn: async () => (await settingApi.get()).data,
      key: `${import.meta.env.VITE_SETTINGS}_${locale}`,
    })

    settings.value = data
  }
  
  async function getHandleFee() {
    const { data } = await rechargeApi.payFee()
    handleFee.value = data
  }

  return {
    settings,
    originUrl,
    handleFee,

    getSettings,
    getHandleFee,
  }
})
