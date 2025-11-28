import { getUserInfo } from "@/api/shop"
import { zUserInfo, type UserInfo } from "@/inters/user"
import { defineStore } from "pinia"

export const useUserStore = defineStore("user-store", () => {
  const userInfo = ref<UserInfo>(zUserInfo.parse({}))

  async function getUser() {
    userInfo.value = await getUserInfo()
  }

  return {
    userInfo,

    getUser,
  }
})