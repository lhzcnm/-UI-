import type { UserInfo } from '@/api/user'

import { defineStore } from 'pinia'
import { userApi } from '@/api/user'
import { useFetchWithCache } from '@3un/utils'

export const useUserStore = defineStore('userStore', () => {
  const uKey = import.meta.env.VITE_USER_INFO
  const info = ref() as Ref<UserInfo>

  async function getInfo(force = false) {
    const data = await useFetchWithCache({
      fetchData: async () => (await userApi.info()).data,
      key: uKey,
      force,
    })

    info.value = data
  }

  async function updateCredit() {
    const { data } = await userApi.credit()
    info.value.credits = data
    saveInfo()
  }

  async function updateName(name: string) {
    await userApi.updateInfo({ name })
    info.value.username = name
    saveInfo()
  }

  async function refreshApi() {
    const { data } = await userApi.apiKey()
    info.value.bulkCheckApi = data
    saveInfo()
  }

  async function logout() {
    await userApi.logout()

    sessionStorage.clear()
    localStorage.clear()
    location.reload()
  }

  function saveInfo() {
    const userInfo = JSON.stringify(info.value)
    sessionStorage.setItem(uKey, userInfo)
  }

  return {
    info,
    getInfo,
    updateCredit,
    updateName,
    refreshApi,
    saveInfo,
    logout,
  }
})
