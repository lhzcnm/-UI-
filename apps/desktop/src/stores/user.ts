import type { UserInfo } from '@3un/shared/users'

import { defineStore } from 'pinia'
import { useFetchWithCache } from '@3un/utils'
import userApi from '@/api/users'

export const useUserStore = defineStore('userStore', () => {
  const uKey = import.meta.env.VITE_USER
  const info = ref() as Ref<UserInfo>

  async function getInfo() {
    const data = await useFetchWithCache({
      fetchData: userApi.info,
      key: uKey,
    })

    info.value = data
  }

  return {
    info,
    getInfo,
  }
})
