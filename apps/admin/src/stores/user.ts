import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const isAdminAuth = ref<boolean>(false)

  return {
    isAdminAuth,
  }
})