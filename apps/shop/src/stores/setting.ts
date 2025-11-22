import { getSetting } from "@/api/setting"
import { type Setting, zSettiing } from "@/inters/setting"
import { useStorage } from "@vueuse/core"
import { defineStore } from "pinia"

export const useSettingStore = defineStore("setting", () => {
  const setting = useStorage<Setting>('setting', zSettiing.parse({}), sessionStorage)

  async function getSettings() {
    const data = await getSetting()

    setting.value = data
  }

  return {
    setting,
    
    getSettings,
  }
})