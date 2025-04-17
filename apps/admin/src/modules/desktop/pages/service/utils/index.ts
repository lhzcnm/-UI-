import type { ServiceCreateParams } from '@/inters/services'
import type { InjectionKey } from "vue"

export interface ServiceStore {
  createForm: ServiceCreateParams
  updateForm: ServiceCreateParams
  visableCreate: boolean
  visableUpdate: boolean
  page: number
  limit: number
}

export const SERVICE_STORE: InjectionKey<ServiceStore> = Symbol('SERVICE_STORE')
