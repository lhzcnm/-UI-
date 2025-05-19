import type { ServiceField, ServiceFieldCreateParams, ServiceGroupCreateParams, ServiceCreateParams, UnlockCreateParams, Unlock } from '@/inters/services'
import type { IList } from '@3un/shared'
import type { InjectionKey } from "vue"

type IK<T> = InjectionKey<T>

// Service
export const SERVICE_STORE: IK<ServiceStore> = Symbol('service')
export interface ServiceStore {
  formBase: ServiceCreateParams
  formSearch: ServiceSearch
  visibleBase: boolean
  index: number | undefined
}

interface ServiceSearch {
  categoryId: number | undefined
  keyword: string
}

// ServiceGroup
export const GROUP_STORE: IK<ServiceGroupStore> = Symbol('group')
export interface ServiceGroupStore {
  formBase: ServiceGroupCreateParams
  visibleBase: boolean
  index: number | undefined
}

// ServiceField
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

// Unlock
export const UNLOCK_STORE: IK<UnlockStore> = Symbol('unlock')
export interface UnlockStore {
  unlocks: Unlock[]
  formBase: UnlockCreateParams
  visibleBase: boolean
  visibleConvert: boolean
  index: number | undefined
}
