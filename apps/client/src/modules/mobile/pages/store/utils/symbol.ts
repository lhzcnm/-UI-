import type { ServiceDetail, ServiceItem, ServiceParams, SubmitParams } from '@/api/store/types'
import type { InjectionKey } from 'vue'
import type { StoreType } from './types'

export interface ServiceStore {
  visibleFilter: boolean,
  submited: boolean,

  groupMap: Map<number, string>,
  groupServiceMap: Map<number, ServiceItem[]>,
  serviceMap: Map<number, ServiceItem>,
  
  serviceSearch: ServiceParams,
  services: ServiceDetail[],
  selService: ServiceItem | null,
  createOrder: SubmitParams,

  payType: 'wxpay' | 'alipay',

  storeStatus: 'service' | 'profile' | 'detail',
 
  storeType: StoreType,

  displayMode: 'flex' | 'grid',
}

type ServiceStoreKey = InjectionKey<ServiceStore>

export const SERVICE_STORE = Symbol('service-store') as ServiceStoreKey
