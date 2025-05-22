import type { ServiceField, ServiceFieldCreateParams, ServiceGroupCreateParams, ServiceCreateParams, UnlockCreateParams, Unlock } from '@/inters/services'
import type { IList, IK } from '@3un/shared'

// Service
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
export interface ServiceGroupStore {
  formBase: ServiceGroupCreateParams
  visibleBase: boolean
  index: number | undefined
}

// ServiceField
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
export interface UnlockStore {
  unlocks: Unlock[]
  formBase: UnlockCreateParams
  visibleBase: boolean
  visibleConvert: boolean
  index: number | undefined
}

// Store
export const SERVICE_STORE: IK<ServiceStore> = Symbol('service')
export const GROUP_STORE: IK<ServiceGroupStore> = Symbol('group')
export const FIELD_STORE: IK<ServiceFieldStore> = Symbol('field')
export const UNLOCK_STORE: IK<UnlockStore> = Symbol('unlock')
