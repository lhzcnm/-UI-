import type { InjectionKey } from 'vue'

import type { StoreOrderView, StoreStatus } from './types'
import type { ServiceDetail, ServiceItem, ServiceParams } from '../api/types'
import type { UserInfo } from '@/api/user'

export interface ServiceStore {
  visibleConfirm: boolean,
  visibleQrcode: boolean,
  visibleTool: boolean,

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

  payType: 'wxpay' | 'alipay',

  rawOrder: StoreOrderView[],
}

export interface DeviceStore {
  visibleChart: boolean,

  selectCategory: number,
}

export enum ToolStatus {
  ROOT     = 0,
  LANGUAGE = 1,
  GROUP    = 2,
}

export interface ToolGlobalStore {
  toolStatus: ToolStatus
}

type ServiceStoreKey = InjectionKey<ServiceStore>
export const SERVICE_STORE = Symbol('market-store') as ServiceStoreKey

type DeviceStoreKey = InjectionKey<DeviceStore>
export const DEVICE_STORE = Symbol('device-store') as DeviceStoreKey

type ToolGlobalStoreKey = InjectionKey<ToolGlobalStore>
export const TOOL_STORE = Symbol('tool-store') as ToolGlobalStoreKey
