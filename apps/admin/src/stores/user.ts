import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isAdminAuth = useStorage('isAdminLogin', false, sessionStorage)

  return {
    isAdminAuth,
  }
})
