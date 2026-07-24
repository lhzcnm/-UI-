import { localApi } from "@/api/local"
import { defineStore } from "pinia"

// export const useLocalStore = defineStore('useLocalStore', {
//   state: () => ({
//     localData: {} as any
//   }),

//   actions: {
//     async getLocalData() {
//       const local = localStorage.getItem('locale')
//       const res = await localApi.getLocal(local? local : 'zh')
//       this.localData = res.data
//     }
//   }
// })

export const useLocalStore = defineStore('locale', () => {
  const localData = ref<Record<string, string>>({})

  async function getLocalData() {
    const local = localStorage.getItem('locale')
    const { data } = await localApi.getLocal(local ? local : 'zh')
    localData.value = data
  }

  function localeSlotVal(key: string, slots: Record<string, string | number>) {
    let res = localData.value[key]
    if (!res) return ''

    for (const [slot, val] of Object.entries(slots)) {
      const newVal = val.toString()
      const placeholder = slot.startsWith('{') && slot.endsWith('}')
        ? slot
        : `{${slot}}`

      res = res.replace(new RegExp(placeholder, 'g'), newVal)
    }

    return res
  }

  return {
    localData,

    localeSlotVal,
    getLocalData,
  }
})
