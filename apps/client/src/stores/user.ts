import type { UserInfo } from '@/api/user'
import { defineStore } from 'pinia'
import { userApi } from '@/api/user'
import { useFetchWithCache } from '@3un/utils'
import type { quoteIhone } from '@/modules/mobile/pages/profile/utils'

export interface price{
  big: number
  LikeNewPhone: number
  StylishPhone: number
  ScratchPhone: number
  PartsPhone: number
}

//测试类型
export interface popularModelsType{
  name: string
  price: price[]
}

interface Quote{
  

  PopularModelsObj: popularModelsType
  PopularModelsData: popularModelsType[]

  
}

export const useUserStore = defineStore('userStore', () => {
  const quote = ref<Quote>({

    PopularModelsObj: {} as popularModelsType,
    PopularModelsData: [],

  })
  const info = ref<UserInfo>({} as UserInfo)

  const iphoneImagsDark = ref<quoteIhone[]>([
    {
      iphone:'/iphoneImgs/dark_iphone_black.png',
      name: '靓机/小花'
    },
    {
      iphone:'/iphoneImgs/dark_iphone_white.png',
      name: '花机/内爆'
    },
    {
      iphone:'/iphoneImgs/dark_iphone_yellow.png',
      name: '卡贴外版'
    },
    {
      iphone:'/iphoneImgs/dark_iphone_pink.png',
      name: '外版无锁'
    }
    ])

  const iphoneImgs = ref<quoteIhone[]>([
    {
      iphone:'/iphoneImgs/iphone_black.png',
      name: '靓机/小花'
    },
    {
      iphone:'/iphoneImgs/iphone_white.png',
      name: '花机/内爆'
    },
    {
      iphone:'/iphoneImgs/iphone_yellow.png',
      name: '卡贴外版'
    },
    {
      iphone:'/iphoneImgs/iphone_pink.png',
      name: '外版无锁'
    },
  ])

  async function getInfo(force = false) {
    const locale = localStorage.getItem('locale') ?? 'zh'

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
    iphoneImagsDark,
    iphoneImgs,
    quote,
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
