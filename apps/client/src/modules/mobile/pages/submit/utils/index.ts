import type { Service } from '@/api/services'
import type { Order } from '@/api/orders'
import type { InjectionKey } from 'vue'

export interface SubmitStore {
  service: Service | undefined
  serviceId: number
  rawOrders: Order[]
  visible: boolean
  count: number
  serviceHeader: string[]
}

type SubmitStoreKey = InjectionKey<SubmitStore>
export const SUBMIT_STORE = Symbol('submitStore') as SubmitStoreKey
