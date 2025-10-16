import type { InjectionKey } from 'vue'

import type { Service } from '@/api/services'
import type { FormType } from './types'
import type { ServiceGroup, ServiceParams } from '../api/types'

export interface MarketStore {
  visibleOrder: boolean,
  visibleDetail: boolean,

  serviceSearch: ServiceParams,
  groupMap: Map<number, string>,
  services: ServiceGroup[],
  serviceMap: Map<number, Service>,
  createOrder: FormType,

  // groupId: number,
  // serviceId: number,

  selectService: Service,
}

type MarketStoreKey = InjectionKey<MarketStore>
export const MARKET_STORE = Symbol('market-store') as MarketStoreKey

// interface Form {
//   services: ServiceGroup,
// }

// export const form: Form = {
//   services: {id: 0, title: "", children: []}
// }
