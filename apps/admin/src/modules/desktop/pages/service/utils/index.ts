import type { ServiceCreateParams } from '@/inters/services'
import type { InjectionKey } from "vue"

export interface ServiceStore {
  form: ServiceCreateParams
  index: number | undefined
  visable: boolean
  page: number
  limit: number
}

export const SERVICE_STORE: InjectionKey<ServiceStore> = Symbol('SERVICE_STORE')
