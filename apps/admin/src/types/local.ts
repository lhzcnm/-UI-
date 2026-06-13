export interface getLocalParams {
  page: number
  pageSize: number
  ch?: string
  en?: string
  fullKey?: string
  module?: number
}

export interface postLocalParams {
  remark: string
  module: number
  messageKey: string
  ch: string
  en: string
}

export interface putLocalParams extends postLocalParams {
  id?: number
}

export interface localList {
  id: number
  messageKey: string
  ch: string
  en: string
  createTime: string
  updateTime: string
}

export interface localListTableTypes {
  id: number
  messageKey: string
  ch: string
  en: string
  createTime: string
  updateTime: string
  module: number
  moduleName: string
}