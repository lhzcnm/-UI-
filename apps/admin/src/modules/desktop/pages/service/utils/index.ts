import type { Service, ServiceGroup } from '@/inters/services'
import type { InjectionKey } from "vue"

type IK<T> = InjectionKey<T>

export const SERVICE_STORE: IK<ServiceStore> = Symbol('service')
export interface ServiceStore {
  form: Service
  visible: boolean
  page: number
  limit: number
}

export const GROUP_STORE: IK<ServiceGroupStore> = Symbol('group')
export interface ServiceGroupStore {
  form: ServiceGroup
  visible: boolean
}
