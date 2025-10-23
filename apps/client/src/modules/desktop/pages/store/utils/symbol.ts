import type { InjectionKey } from 'vue'

import type { StoreStatus } from './types'
import type { ServiceDetail, ServiceItem, ServiceParams } from '../api/types'
import type { UserInfo } from '@/api/user'

export interface ServiceStore {
  visibleConfirm: boolean,
  visibleQrcode: boolean,

  url: string,

  groupMap: Map<number, string>,
  groupServiceMap: Map<number, ServiceItem[]>,
  serviceMap: Map<number, ServiceItem>,

  serviceSearch: ServiceParams,
  services: ServiceDetail[],
  // createOrder: SubmitParams,
  imeiList: string[],
  selectService: ServiceItem,
  userInfo: UserInfo | null,

  storeStatus: StoreStatus,

  payType: 'wxpay' | 'alipay'
}

type ServiceStoreKey = InjectionKey<ServiceStore>
export const SERVICE_STORE = Symbol('market-store') as ServiceStoreKey

export const form = {

}
