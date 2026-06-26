import { localApi } from '@/api/local'
import type { getLocalParams, localList, putLocalParams } from '@/types/local'
import { defaultPageSize } from '@/utils'
import { defineStore } from 'pinia'


export const useLocalStore = defineStore('useLocalStore', {
  state: () => ({
    // 模块路径参数
    query: '-1',
    // 公众号开关
    isShow: false,
    searchForm: searchForm,
    createForm: { ...createLocalForm },
    updateForm: { ...createLocalForm },
    localDialog: localDialogDefault,
    total: 100,

    localList: [] as localList[]
  }),

  actions: {
    async getData() {
      try {
        const params = this.searchForm
        const res = await localApi.getLocal(params) as any
        this.total = res.data.total
        this.localList = res.data.list
      } catch (e) {

      }
    }
  }
})

export const searchForm: getLocalParams = {
  page: 1,
  pageSize: defaultPageSize,
  ch: '',
  en: '',
  fullKey: '',
  module: undefined
}

interface localDialogTypes {
  searchDialog: boolean
  createDialog: boolean
  updateDialog: boolean
}

export const localDialogDefault: localDialogTypes = {
  searchDialog: false,
  createDialog: false,
  updateDialog: false
}

export const createLocalForm: putLocalParams = {
  remark: '',
  module: -1,
  id: undefined,
  messageKey: '',
  ch: '',
  en: ''
}