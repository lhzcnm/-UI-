import { localApi } from "@/api/local"
import { defineStore } from "pinia"

export const useLocalStore = defineStore('useLocalStore', {
  state: () => ({
    localData: {} as any
  }),

  actions: {
    async getLocalData() {
      const local = localStorage.getItem('locale')
      const res = await localApi.getLocal(local? local : 'zh')
      this.localData = res.data
    }
  }
})