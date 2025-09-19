import type { InjectionKey } from 'vue'

// import type { ServiceGroup } from '../api/types'
import type { Service, ServiceDetail } from '@/api/services'
import type { FormType } from './types'

export interface MarketStore {
  visibleOrder: boolean,
  visibleDetail: boolean,

  services: ServiceDetail[],
  serviceMap: Map<number, Service>,
  createOrder: FormType,

  groupId: number,
  serviceId: number,

  selectService: Service,
}

type MarketStoreKey = InjectionKey<MarketStore>
export const MARKET_STORE = Symbol('market-store') as MarketStoreKey
