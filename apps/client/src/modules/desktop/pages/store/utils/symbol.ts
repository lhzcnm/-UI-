import type { InjectionKey } from 'vue'

export interface MarketStore {
  services: any,

  groupId: number,
  serviceId: number,
}

type MarketStoreKey = InjectionKey<MarketStore>
export const MARKET_STORE = Symbol('market-store') as MarketStoreKey
