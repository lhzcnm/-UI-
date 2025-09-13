import type { UserInfo } from '@/api/user'

import { defineStore } from 'pinia'
import { userApi } from '@/api/user'
import { useFetchWithCache } from '@3un/utils'

export const useUserStore = defineStore('userStore', () => {
  const info = ref<UserInfo>({} as UserInfo)

  async function getInfo(force = false) {
    const locale = useI18n().locale.value

    const data = await useFetchWithCache({
      fetchFn: async () => (await userApi.info()).data,
      key: `${import.meta.env.VITE_USER_INFO}_${locale}`,
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

  async function openBulkApi() {
    const [bulkKey, _] = await Promise.all([
      userApi.apiBulkKey(),
      userApi.apiKey(),
    ])

    info.value.bulkCheckApi = bulkKey.data
    saveInfo()
  }

  async function refreshBulkApi() {
    const bulkKey = await userApi.apiBulkKey()
    info.value.bulkCheckApi = bulkKey.data
    saveInfo()
  }

  async function refreshApi() {
    const { data } = await userApi.apiKey()
    info.value.apiKey = data
    saveInfo()
  }

  async function logout() {
    await userApi.logout()

    sessionStorage.clear()
    localStorage.clear()
    location.reload()
  }

  function saveInfo() {
    const locale = useI18n().locale.value
    const userInfo = JSON.stringify(info.value)
    sessionStorage.setItem(`${import.meta.env.VITE_USER_INFO}_${locale}`, userInfo)
  }

  return {
    info,
    getInfo,
    updateCredit,
    updateName,
    openBulkApi,
    refreshBulkApi,
    refreshApi,
    saveInfo,
    logout,
  }
})
