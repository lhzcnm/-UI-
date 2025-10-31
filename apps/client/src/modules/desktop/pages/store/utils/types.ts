import type { OrderRecommend } from '@/api/orders'
import type { Service } from '@/api/services'
import type { ORDER_STATUS, ORDER_VERIFY } from '@3un/utils'
import type { ClassNameValue } from 'tailwind-merge'

export type StoreStatus = 'serviceStore' | 'serviceDetail' | 'DeviceStore'

export interface FormType {
  serviceId: number,
  price: number,
  imei: string,
  pushRes: boolean,
  phone: string,
  mail: string,
}

export interface Form {
  service: Service
}

export interface StoreOrder {
  id: number
  serviceId: number
  status: ORDER_STATUS
  verify: ORDER_VERIFY
  imei: string
  credits: number
  remark: string
  result: string
  createTime: string
  recommends: OrderRecommend[] | null
}

export interface StoreOrderView {
  id: number
  index: number
  serviceId: number | null
  serviceName: string | null
  status: ORDER_STATUS
  verify: ORDER_VERIFY
  imei: string
  credits: number
  result: string
  createTime: string
}

export interface StoreSubmitOrder {
  status: ORDER_STATUS
  message: string
  imei: string
}

export interface DeviceCategory {
  id: 0 | 1 | 2 | 3,
  name: string,
}

export interface ProductItem {
  id: number,
  category: 0 | 1 | 2 | 3,
  name: string,
  price: number,
  originalPrice: number,
  image: string,
  colors: string[],
  storage: string[],
  features: string[],
  description: string,
  specs: Record<string, string>,
}

export interface ToolItem {
  id: string,
  name: string,
  icon: string,
}

export interface ToolGlobalProps {
  class: ClassNameValue,
}
