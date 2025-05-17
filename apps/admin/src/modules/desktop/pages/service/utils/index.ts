import type { ServiceField, ServiceFieldCreateParams, ServiceGroupCreateParams, ServiceCreateParams } from '@/inters/services'
import type { IList } from '@3un/shared'
import type { InjectionKey } from "vue"

type IK<T> = InjectionKey<T>

// 服务
export const SERVICE_STORE: IK<ServiceStore> = Symbol('service')
export interface ServiceStore {
  formBase: ServiceCreateParams
  formSearch: ServiceSearch
  visibleBase: boolean
  index: number | undefined
}

interface ServiceSearch {
  categoryId: number
  keyword: string
}

// 服务组
export const GROUP_STORE: IK<ServiceGroupStore> = Symbol('group')
export interface ServiceGroupStore {
  formBase: ServiceGroupCreateParams
  visibleBase: boolean
  index: number | undefined
}

// 服务字段
export const FIELD_STORE: IK<ServiceFieldStore> = Symbol('field')
export interface ServiceFieldStore {
  fields: IList<ServiceField>
  formBase: ServiceFieldCreateParams
  visibleBase: boolean
  index: number | undefined
  loading: boolean
  refresh: boolean
  page: number
  limit: number
}
